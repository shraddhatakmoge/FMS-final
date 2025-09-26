from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils.dateparse import parse_date
from admin1.add_franchise.models import AddFranchise
from .models import Staff, AttendanceRecord
from .serializers import StaffSerializer, AttendanceRecordSerializer, BulkAttendanceSerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        request = self.request
        user = getattr(request, 'user', None)
        # If authenticated franchise head, scope to their own franchise (via AddFranchise.user)
        if getattr(user, 'is_authenticated', False) and getattr(user, 'role', None) == 'franchise_head':
            fran = AddFranchise.objects.filter(user=user).first()
            if fran:
                # Staff.franchise is legacy name string
                return qs.filter(franchise=fran.name)

        franchise_param = request.query_params.get('franchise')
        if franchise_param:
            # franchise stored as name in Staff; param may be AddFranchise id
            try:
                # If integer, map to franchise name
                fid = int(franchise_param)
                fran = AddFranchise.objects.filter(id=fid).first()
                if fran:
                    return qs.filter(franchise=fran.name)
            except ValueError:
                # treat as name
                return qs.filter(franchise=franchise_param)
        return qs

    def destroy(self, request, *args, **kwargs):
        staff = self.get_object()
        user = getattr(staff, "user", None)

        # Delete the linked user first
        if user:
            user.delete()  # deletes email, password, everything in auth_user table

        # Delete staff after user
        staff.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class AttendanceViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    """Attendance endpoints used by Franchise AttendanceSystem frontend.
    GET /api/attendance/?franchise=<id>&date=<YYYY-MM-DD>
    POST /api/attendance/  (bulk upsert)
    GET /api/attendance/monthly?franchise=<id>&month=<YYYY-MM>
    """

    def list(self, request):
        franchise_param = request.query_params.get('franchise')
        date_str = request.query_params.get('date')

        # Franchise scoping: for franchise_head and staff, override franchise to the user's franchise
        user = getattr(request, 'user', None)
        if getattr(user, 'is_authenticated', False) and getattr(user, 'role', None) in ('franchise_head', 'staff'):
            fran = None
            if getattr(user, 'role', None) == 'franchise_head':
                fran = AddFranchise.objects.filter(user=user).first()
            else:  # staff
                staff = Staff.objects.filter(user=user).select_related('franchise_fk').first()
                fran = getattr(staff, 'franchise_fk', None)
                if fran is None and staff and getattr(staff, 'franchise', None):
                    fran = AddFranchise.objects.filter(name=staff.franchise).first()
            if fran:
                franchise_param = str(fran.id)

        if not franchise_param or not date_str:
            return Response([], status=status.HTTP_200_OK)

        try:
            fid = int(franchise_param)
        except (TypeError, ValueError):
            return Response({"detail": "franchise must be an integer id"}, status=status.HTTP_400_BAD_REQUEST)

        date_obj = parse_date(date_str)
        if not date_obj:
            return Response({"detail": "Invalid date"}, status=status.HTTP_400_BAD_REQUEST)

        records = AttendanceRecord.objects.filter(franchise_id=fid, date=date_obj)
        data = AttendanceRecordSerializer(records, many=True).data
        return Response(data)

    def create(self, request):
        # Accept either a list of records or a single record dict
        incoming = request.data
        if isinstance(incoming, dict):
            items = [incoming]
        elif isinstance(incoming, list):
            items = incoming
        else:
            return Response({"detail": "Unsupported payload type"}, status=status.HTTP_400_BAD_REQUEST)

        # normalize input: ensure franchise id is present and valid
        payload = []
        user = getattr(request, 'user', None)
        # If franchise head or staff, force franchise to their own franchise id
        enforced_franchise_id = None
        if getattr(user, 'is_authenticated', False) and getattr(user, 'role', None) in ('franchise_head', 'staff'):
            fran = None
            if getattr(user, 'role', None) == 'franchise_head':
                fran = AddFranchise.objects.filter(user=user).first()
            else:  # staff
                staff = Staff.objects.filter(user=user).select_related('franchise_fk').first()
                fran = getattr(staff, 'franchise_fk', None)
                if fran is None and staff and getattr(staff, 'franchise', None):
                    fran = AddFranchise.objects.filter(name=staff.franchise).first()
            if fran:
                enforced_franchise_id = fran.id

        for item in items:
            # Minimal validation
            # If we can enforce franchise, only require person_id and date
            required_keys = ("person_id", "date") if enforced_franchise_id is not None else ("franchise", "person_id", "date")
            if not all(k in item for k in required_keys):
                return Response({"detail": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
            if enforced_franchise_id is not None:
                item = {**item, 'franchise': enforced_franchise_id}
            payload.append(item)

        # Validate using lightweight input serializer to avoid unique_together model validation on input
        from .serializers import AttendanceInputSerializer
        serializer = AttendanceInputSerializer(data=payload, many=True)
        serializer.is_valid(raise_exception=True)

        # Bulk upsert
        created = []
        for item in serializer.validated_data:
            ptype = item.get('person_type', 'staff')
            # franchise in validated_data may be a model instance; extract id
            fran_val = item.get('franchise')
            fid = getattr(fran_val, 'id', fran_val)
            obj, _ = AttendanceRecord.objects.update_or_create(
                franchise_id=fid,
                person_type=ptype,
                person_id=item['person_id'],
                date=item['date'],
                defaults={
                    'status': item.get('status', 'Present'),
                    'in_time': item.get('in_time'),
                    'out_time': item.get('out_time'),
                }
            )
            created.append(obj)
        return Response(AttendanceRecordSerializer(created, many=True).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='monthly')
    def monthly(self, request):
        franchise_param = request.query_params.get('franchise')
        month = request.query_params.get('month')  # YYYY-MM
        # Franchise scoping for franchise_head and staff
        user = getattr(request, 'user', None)
        if getattr(user, 'is_authenticated', False) and getattr(user, 'role', None) in ('franchise_head', 'staff'):
            fran = None
            if getattr(user, 'role', None) == 'franchise_head':
                fran = AddFranchise.objects.filter(user=user).first()
            else:  # staff
                staff = Staff.objects.filter(user=user).select_related('franchise_fk').first()
                fran = getattr(staff, 'franchise_fk', None)
            if fran:
                franchise_param = str(fran.id)

        if not franchise_param or not month:
            return Response({"detail": "franchise and month required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            fid = int(franchise_param)
        except (TypeError, ValueError):
            return Response({"detail": "franchise must be an integer id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            year, mon = map(int, month.split('-'))
        except Exception:
            return Response({"detail": "month must be YYYY-MM"}, status=status.HTTP_400_BAD_REQUEST)

        records = AttendanceRecord.objects.filter(franchise_id=fid, date__year=year, date__month=mon)
        data = AttendanceRecordSerializer(records, many=True).data
        return Response(data)

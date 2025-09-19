from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Batch
from .serializers import BatchSerializer

@api_view(["GET"])
def get_batches(request):
    batches = Batch.objects.all()
    serializer = BatchSerializer(batches, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def add_batch(request):
    serializer = BatchSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
def update_batch(request, pk):
    try:
        batch = Batch.objects.get(id=pk)
    except Batch.DoesNotExist:
        return Response({"error": "Batch not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = BatchSerializer(batch, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

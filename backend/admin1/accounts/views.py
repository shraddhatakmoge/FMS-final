from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import get_user_model

User = get_user_model()

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            role = data.get("role")
        except Exception:
            return JsonResponse({"success": False, "error": "Invalid request body"}, status=400)

        user = authenticate(request, username=email, password=password)
        if user is None:
            return JsonResponse({"success": False, "error": "Invalid credentials"}, status=401)

        # ✅ Ensure role matches
        if user.role != role:
            return JsonResponse({"success": False, "error": "Role mismatch"}, status=403)

        # ✅ Log user into session (so Django knows they are authenticated)
        login(request, user)

        # ✅ Define role-based redirects
        role_redirects = {
            "admin": "/admin/dashboard",
            "franchise_head": "/franchise/dashboard",
            "staff": "/staff/dashboard",
            }
        
        return JsonResponse({
            "success": True,
            "message": f"Welcome {user.role}!",
            "role": user.role,
            "branch": user.branch,
            "email": user.email,
            "redirect_url": role_redirects.get(user.role, "/login"),
            })
        
        
    return JsonResponse({"success": False, "error": "Invalid request method"}, status=405)

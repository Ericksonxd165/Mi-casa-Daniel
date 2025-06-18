from django.shortcuts import redirect

def admin_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.session.get('is_admin'):
            return redirect('adminuser:admin_login')  # ✅ con namespace
        return view_func(request, *args, **kwargs)
    return wrapper

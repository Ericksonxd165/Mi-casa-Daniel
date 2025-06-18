import re
from django.middleware.csrf import CsrfViewMiddleware
from django.conf import settings

class CustomCsrfMiddleware(CsrfViewMiddleware):
    def process_view(self, request, callback, callback_args, callback_kwargs):
        # Check if the URL matches any exempt patterns
        path = request.path_info.lstrip('/')
        
        # Obtener las URLs exentas desde settings
        exempt_urls = getattr(settings, 'CSRF_EXEMPT_URLS', [])
        
        if any(re.match(exempt_url, path) for exempt_url in exempt_urls):
            print(f"CSRF exempt for path: {path}")  # Debug print
            return None  # Skip CSRF validation for exempt URLs
        
        # Otherwise, apply normal CSRF validation
        return super().process_view(request, callback, callback_args, callback_kwargs)
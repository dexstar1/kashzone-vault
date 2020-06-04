from django.shortcuts import render, render_to_response

# Create your views here.


def landing_page(request):
    return render(
        request,
        'base/landing_page.html',
    )


def handler404(request, exception, template_name="404.html",):
    response = render_to_response("base/errors/404.html")
    response.status_code = 404
    return response


def handler500(request, template_name="500.html",):
    response = render_to_response("base/errors/500.html")
    response.status_code = 500
    return response

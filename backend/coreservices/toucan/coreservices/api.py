"""Toucan API."""
from datetime import datetime

from aiohttp import web
from aiohttp.web import Application, Response, _run_app, json_response

import aiohttp_cors

from toucan import task
from toucan.coreservices import submission
from toucan.dataclass import UserSubmission

routes = web.RouteTableDef()


@routes.post('/submission')
async def post_submission(request):
    """POST submission."""
    body = await request.json()

    try:
        timestamp = int(datetime.utcnow().strftime('%s'))
        submission_data = UserSubmission(**body, timestamp=timestamp)
    except TypeError:
        return Response(status=400)

    submission_id = await submission.add_submission(submission_data)

    return json_response({
        'submission_id': submission_id,
        'timestamp': timestamp
    })


@routes.get('/tasks')
async def get_tasks(request):
    """GET tasks."""
    params = request.rel_url.query

    if list(params.values()).count('') or \
            ('user_id' not in list(params.keys()) or
             'number' not in list(params.keys()) or
             'offset' not in list(params.keys())):
        return Response(status=400)

    user_id = int(params.get('user_id'))
    number = int(params.get('number'))
    offset = int(params.get('offset'))

    tasks = await task.get_tasks(user_id, number, offset)

    return json_response(tasks)


@routes.get('/task/{alias}')
async def get_task_by_alias(request):
    """GET task by alias."""
    alias = request.match_info['alias']
    task_info = await task.get_task_info(alias)

    if task_info is None:
        return Response(status=400)

    return json_response(task_info)


@routes.get('/submissions')
async def get_submissions(request):
    """Get list of submissions."""
    params = request.rel_url.query

    if list(params.values()).count('') or \
            ('user_id' not in list(params.keys()) or
             'number' not in list(params.keys()) or
             'offset' not in list(params.keys())):
        return Response(status=400)

    user_id = int(params.get('user_id'))
    number = int(params.get('number'))
    offset = int(params.get('offset'))

    submissions = await submission.get_all(user_id, number, offset)

    return json_response(submissions)


@routes.get(r'/submission/{submission_id:\d+}')
async def get_submission(request):
    """Get submission by id."""
    submission_id = int(request.match_info['submission_id'])

    submission_data = await submission.get_submission(submission_id)

    return json_response(submission_data)


@routes.get(r'/result/{submission_id:\d+}')
async def get_result(request):
    """Get result."""
    submission_id = int(request.match_info['submission_id'])

    result = await submission.get_result(submission_id)

    return json_response(result)


@routes.get(r'/test_results/{submission_id:\d+}')
async def get_test_results(request):
    """Get all test results."""
    submission_id = int(request.match_info['submission_id'])

    tests = await submission.get_test_results(submission_id)

    return json_response(tests)


app = Application()

cors = aiohttp_cors.setup(app,
                          defaults={
                              "*":
                              aiohttp_cors.ResourceOptions(
                                  allow_credentials=True,
                                  expose_headers="*",
                                  allow_headers="*",
                              )
                          })

app.add_routes(routes)

for route in app.router.routes():
    cors.add(route)


async def run():
    """Start api using existing event loop."""
    await _run_app(app, port=4000)

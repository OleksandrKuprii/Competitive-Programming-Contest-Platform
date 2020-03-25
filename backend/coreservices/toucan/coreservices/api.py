"""Toucan API."""
import json
from datetime import datetime

from aiohttp import web
from aiohttp.web import Application, Response, _run_app, json_response

from toucan import task
from toucan.dataclass import UserSubmission

from .submission import add_submission, get_result as submission_get_result


routes = web.RouteTableDef()


@routes.post('/submission')
async def post_submission(request):
    """POST submission."""
    body = await request.json()

    try:
        timestamp = int(datetime.utcnow().strftime('%s'))
        submission = UserSubmission(**body, timestamp=timestamp)
    except TypeError:
        return Response(status=400)

    submission_id = await add_submission(submission)

    return Response(status=200, text=str(submission_id))


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
    tasks = json.dumps(tasks)

    return json_response(tasks)


@routes.get('/task/{alias}')
async def get_task_by_alias(request):
    """GET task by alias."""
    alias = request.match_info['alias']
    task_info = await task.get_task_info(alias)

    if task_info is None:
        return Response(status=400)

    task_info = json.dumps(task_info)

    return json_response(task_info)


@routes.get('/result/{submission_id}')
async def get_result(request):
    submission_id = int(request.match_info['submission_id'])

    result = await submission_get_result(submission_id)

    return json_response(json.dumps(result))


app = Application()
app.add_routes(routes)


async def run():
    """Start api using existing event loop."""
    await _run_app(app, port=3000)

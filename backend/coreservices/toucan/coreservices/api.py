"""Toucan API."""
from datetime import datetime

from aiohttp import web

from toucan.dataclass import UserSubmission

from .submission import add_submission

routes = web.RouteTableDef()


@routes.post('/api/submission')
async def handle(request):
    """Handle submission publication."""
    body = await request.json()

    submission = UserSubmission(**body,
                                timestamp=int(
                                    datetime.utcnow().strftime('%s')))

    await add_submission(submission)

    return web.Response(status=200)


@routes.get('/api/task')
async def task(request):
    # body = await request.json()
    from toucan.task import get_task_info

    await get_task_info(5)

    return web.Response(status=200)


app = web.Application()
app.add_routes(routes)


async def run():
    """Start api using existing event loop."""
    await web._run_app(app, port=3000)

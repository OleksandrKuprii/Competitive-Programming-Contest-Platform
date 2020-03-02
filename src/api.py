from datetime import datetime

from aiohttp import web

from src.dataclass import UserSubmission
from src.submission import add_submission

routes = web.RouteTableDef()


@routes.post('/api/submission')
async def handle(request):
    body = await request.json()

    submission = UserSubmission(**body,
                                timestamp=int(
                                    datetime.utcnow().strftime('%s')))

    await add_submission(submission)

    return web.Response(status=200)


app = web.Application()
app.add_routes(routes)


async def run():
    await web._run_app(app, port=8080)

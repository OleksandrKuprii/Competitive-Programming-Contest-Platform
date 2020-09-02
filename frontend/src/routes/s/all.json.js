import fetch from 'node-fetch';


export async function get(req, res, next) {
  if (!req.isAuthenticated()) {
		res.redirect('/login')
    res.end()
		return;
	}

	const tokenSet = req.openid.makeTokenSet(req.session.openidTokens);

	const { access_token, token_type } = tokenSet;

	if (!access_token) {
    res.redirect('/login');
    res.end();
		return;
	}

  const response = await fetch('http://localhost:4000/submissions?offset=0&number=50', {
		headers: {
			Authorization: token_type + ' ' + access_token
		}
	})

  const submissions = await response.json();

  res.json(submissions);
  res.end();
}

import fetch from 'node-fetch';

export async function post(req, res, next) {
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

	let update = {
		nickname: req.body.username,
		name: req.body.fullname,
	}

	delete req.body.username
	delete req.body.fullname

  if (req.body.birthday === '') {
    delete req.body.birthday
  }

	update = { ...update, ...req.body }

	const response = await fetch('http://localhost:4000/profile/my', {
		method: 'POST',
		headers: {
			Authorization: token_type + ' ' + access_token
		},
		body: JSON.stringify(update)
	})

  console.log(await response.text())

	res.redirect('/p')
}

# Frontend notes
*Just to remember stuff I wrote...*

### FAQ

1. Why index.tsx everywhere?

> It seems to be a decent solution to have file per component,
> but then you start to implement
> something like Button atom.
> (i.e. directory helps keeping context,
> makes BaseButton, IconButton, etc connected).

### General recommendations

1. Work on atom properties and consistent API

2. Stateless is better

3. Store is not a trash

4. Write at least NOTES of work you've done. It will help, a lot....

### How does X shit work

1. Registration

> This part is pretty tricky.
> Toucan does forced second registration
> after you had signed in using Auth0.
>
> I recommend you forget about SPA principles while doing
> actions with user account.
> It is better to refresh the page than having fun shit
> like Auth0/Backend exceptions.
>
> Basically ForceRegister does all the main work
> if you follow previous paragraph's recommendation.
> There is the RegisterPage (guess what it does)

### Project directory structure

```python
|
|   # stuff
+-- assets/
|
|   # (re)usable components (i hope)
+-- components/
|   # your buttons, input fields, etc
|   +-- atoms/
|
|   # your button groups
|   +-- molecules/
|   
|   # your page sections
|   +-- organisms/
|
|   # defines the structure
|   +-- templates/
|
|   # data layer
|   +-- providers/
|
|   # does all startup routines
|   +-- startupFetcher/
|
|   # make life simpler
|   +-- helpers/
|
|   # make life harder
|   +-- animations/
|
|   # define your data!
+-- models/
|
|   # custom hooks
+-- hooks/
|
|   # translations
+-- locales/
|
|   # (re)usable styles and GlobalTheme
+-- mixins/
+-- theme/
|
|   # the only thing that's real
+-- pages/
|
|   # all interfaces, type declarations
+-- typings/
|
|   # prefer helper components
+-- utils/
|
|   # Crack CRA
+-- craco.config.js
|
|   # Nodejs's shit
+-- package-lock.json
+-- package.json
|
|   # Yet Another Hack
+-- tsconfig.extend.json
+-- tsconfig.json
|
|   # Maybe PWA support (in future)
+-- workbox.config.js
```


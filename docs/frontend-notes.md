# Frontend notes
*Just to remember stuff I did...*

### FAQ

1. Why not use just file per component istead of directories
with index.tsx?

It seems to be a decent solution before you start to implement
something like Button atom.
(i.e. directory helps keeping context,
makes BaseButton, IconButton, etc connected).

### General recommendations

1. Ignore YAGNI, if you feel so, with atoms/molecules
(if you refactor frequently).

2. Stateless is better, but stateful implementation is cleaner
than stupid property passing + top level component.
ATOMS/MOLECULES MOST OF THE TIME ARE STATELESS

3. Store is only for shared data,
component local state should use useState hook if possible.

4. Write at least NOTES of work you've done. It will help, a lot....

### How X shit works

1. Where X == "Registration"

This part is pretty tricky.
Toucan has forced registration after you signed in using Auth0.

I recommend you forget about SPA principles while doing
actions with user account.
It is better to refresh the page than having fun
with corrupted state or
any other shit like Auth0/Backend exceptions.




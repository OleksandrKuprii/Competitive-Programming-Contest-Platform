# Runner module

## Files

> **run_submission.bash**
* Description:
  Runs submission on specified tests
* Input example:
```json
{
  "submission_id": "my_submission_id",
  "language": "python3",
  "test_ids": [ "my_test_id", "another_test_id" ],
  "limits": {
    "real_time": "0.5",
    "user_time": "0.5"
  }
}
```
* Output example:
```json
[
  {
    "status": "OK",
    "output": "25",
    "real_time": "0.03000",
    "user_time": "0.02000"
  },
  {
    "status": "TL"
  }
]
```
- System dependencies:
  - *at*
  Convenient command scheduling
  - *bc*
  Basic calculator
  - *jq*
  Querying JSON


## Responsible:
- Igor Zashchelkin

© 2020

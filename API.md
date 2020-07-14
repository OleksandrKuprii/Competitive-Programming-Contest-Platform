####POST `/submission`
`Header` Authorization Bearer \<token>

`Request`
```
{   
    "alias": "comics",
    "lang": "python3",
    "code": "..."
}
```

`Response`
```
200 OK
{   
    "submission_id": 1,
    "timestamp": "2020-07-14T16:26:41.024847+03:00"
}
```
```
400 Bad Request
Bad request JSON
```
```
413 Request Entity Too Large
The submitted file is bigger than 64 KB.
{
    "code": "too_big_file",
    "description": "The submitted file is bigger than 64 KB."
}
```
<hr>

####GET `/tasks`
`Params` 

number: int - required

offset: int - required

name_sort = ASC | DESC

category_sort = ASC | DESC

difficulty_sort = ASC | DESC

result_sort = ASC | DESC

date_sort = ASC | DESC

categories = "cat1", "cat2", ..., "catN"

difficulty = 1, 4-9

result = 15, 24-47, zero, full, partial, null

`Response`
```
200 OK
[
    {
        "alias": "comics",
        "name": "Комікси",
        "difficulty": 1,
        "created": "2020-04-02T00:00:00.002000",
        "category": {
            "alias": "graphs",
            "name": "Graphy"
        },
        "best_submission": {
            "result": {
                "points": 0,
                "status": [
                    "WrongAnswer"
                ]
            },
            "id": 1
        },
        "statistics": {
            "full": 0,
            "partial": 0,
            "zero": 0
        }
    },
    {
        "alias": "coins",
        "name": "Монети",
        "difficulty": 3,
        "created": "2020-04-02T00:00:00.002000",
        "category": {
            "alias": "dynamic",
            "name": "Dynamic programming"
        },
        "best_submission": {
            "result": {
                "points": null,
                "status": null
            },
            "id": null
        },
        "statistics": {
            "full": 0,
            "partial": 0,
            "zero": 0
        }
    }
]
```
<hr>

####GET `/tasks/auth`
Identical to GET `/tasks` but requires authorization

`Header` Authorization Bearer \<token>
<hr>

####GET `/task/{alias}`
`Response`
```
200 OK
{
    "wall_time_limit": 1000,
    "cpu_time_limit": 1000,
    "memory_limit": 256,
    "main": "...",
    "input_format": "...",
    "output_format": "...",
    "custom_sections": {
        "Explanation": "..."
    },
    "category": {
        "alias": "dynamic",
        "name": "Dynamic programming"
    },
    "name": "Монети",
    "alias": "coins",
    "examples": [
        {
            "input_data": "10 3\n6 2 10",
            "output_data": "0"
        },
        {
            "input_data": "4 5\\n2 2 3 2 1",
            "output_data": "4"
        }
    ],
    "statistic": [],
    "best_submission": {
        "result": null,
        "id": null
    }
}
```
```
400 Bad Request
There is not task for with this alias
```
<hr>

####GET `/task/auth/{alias}`
Identical to GET `/task/{alias}` but requires authorization

`Header` Authorization Bearer \<token>
<hr>

####GET `/submissions`
`Params`

number: int - required

offset: int - required

`Header` Authorization Bearer \<token>

`Response`
```
200 OK
[
    {
        "id": 2,
        "name": "Паркування",
        "alias": "parking",
        "lang": "c++",
        "published_at": "2020-07-14T15:54:49.751056+00:00",
        "result": {
            "points": 100,
            "status": [
                "Correct"
            ]
        }
    },
    {
        "id": 1,
        "name": "Комікси",
        "alias": "comics",
        "lang": "python3",
        "published_at": "2020-07-14T13:26:41.024847+00:00",
        "result": {
            "points": 0,
            "status": [
                "WrongAnswer"
            ]
        }
    }
]
```
```
400 Bad request
Irregular params
```
<hr>

####GET `/submission/{id}`
`Header` Authorization Bearer \<token>

`Response`
```
200 OK
{
    "name": "Бики та корови ",
    "alias": "bac",
    "lang": "c++",
    "timestamp": "2020-07-14T15:55:00.653770+00:00",
    "tests_count": 20,
    "result": {
        "points": 100,
        "status": [
            "Correct"
        ]
    },
    "tests": [
        {
            "points": 5,
            "status": "Correct",
            "wall_time": 25,
            "cpu_time": 1
        },
        {
            "points": 5,
            "status": "Correct",
            "wall_time": 37,
            "cpu_time": 6
        },
        ...
        {
            "points": 5,
            "status": "Correct",
            "wall_time": 14,
            "cpu_time": 3
        }
    ],
    "code": "..."
}
```
<hr>

####GET `/result/{submission_id}`
`Header` Authorization Bearer \<token>

`Response`
```
200 OK
{
    "points": 100,
    "status": [
        "Correct"
    ]
}
```
<hr>

####GET `/test_results/{submission_id}`
`Header` Authorization Bearer \<token>

`Response`
```
200 OK
[
    {
        "points": 5,
        "status": "Correct",
        "wall_time": 25,
        "cpu_time": 1
    },
    {
        "points": 5,
        "status": "Correct",
        "wall_time": 37,
        "cpu_time": 6
    },
    ...
    {
        "points": 5,
        "status": "Correct",
        "wall_time": 14,
        "cpu_time": 3
    }
]
```
<hr>

####GET `/profile/{nickname}`
`Header` Authorization Bearer \<token>
`Response`
```
200 OK
{
    "nickname": "SashaKuprii",
    "name": "Sasha Kuprii",
    "birthday": "2004-02-04",
    "country": "UA",
    "bio": "Hello, my name is Sasha!",
    "city": "Bucha",
    "school": "PL NTUU KPI",
    "email": "sasha.kuprii@toucan.net.ua",
    "picture": null,
    "registered": "2020-02-25T12:28:57.980000+00:00",
    "public_task_rating": 5
}
```
```
200 OK
There is not user with this nickname
{}
```
<hr>

####GET `/check_nickname/{nickname}`
`Header` Authorization Bearer \<token>
`Response`
```
200 OK
This nickname exists
{
    "nickname_exists": true
}
```
```
200 OK
This nickname does not exist
{
    "nickname_exists": false
}
```
<hr>

####GET `/profile/my`
`Header` Authorization Bearer \<token>
`Response`
```
200 OK
{
    "registered": true,
    "email_verified": true,
    "info": {
        "nickname": "SashaKuprii",
        "name": "Sasha Kuprii",
        "birthday": "2004-02-04",
        "country": "UA",
        "bio": "Hello, my name is Sasha!",
        "city": "Bucha",
        "school": "PL NTUU KPI",
        "email": "sasha.kuprii@toucan.net.ua",
        "picture": null,
        "registered": "2020-02-25T12:28:57.980000+00:00",
        "public_task_rating": 5
    }
}
```
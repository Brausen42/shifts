# Shifts Site and API

This is a project that allows for the creation and subsequent viewing of generic shifts.

## Website

A website is exposed by the server that is a UI for observing all existing shifts, and creating new shifts.

## API

A RESTful JSON API for creating and listing existing shifts is exposed by running the server.

Postman link for a collection to use API: https://www.getpostman.com/collections/79c8046ce402ea0c6614

### GET /api/v1/shifts - List Shifts

Returns a list of existing shifts, ordered by start time.

example response:
```
{
    shifts: [
        {
            id: {{ guid }},
            start_time: {{ unix_epoch_time }},
            end_time; {{ unix_epoch_time }}
        },
        {
            ...
        },
        ...
    ]
}
```
### POST /api/v1/shifts - Create Shift

Create a new shift.

example request body:
```
{
    id: {{ guid }},
    start_time: {{ unix_epoch_time }},
    end_time; {{ unix_epoch_time }}
}
```

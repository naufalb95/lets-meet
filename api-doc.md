POST /users/register => Done
POST /users/login => Done

GET /events?search=&day=&type=online&distance=&category= // Event List 
GET /events/:eventId // Event Detail  => Done
AuthN POST /events/:eventId => user join event => Done
AuthN DELETE  /events/:eventId/participants => ganti join atau gak => Done
AuthN POST /events => bikin event baru => Done
AuthN, AuthZ PUT /events/:eventId => edit event baru  => Done
AuthN, AuthZ DELETE /events/:eventId => delete event baru => Done
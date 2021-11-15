POST /users/register => Done
POST /users/login => Done

GET /events?search=&day=&type=online&distance=&category= // Event List 
GET /events/:eventId // Event Detail  => Done
AuthN POST /events/:eventId => user join event => Done
AuthN DELETE  /events/:eventId/participants => ganti join atau gak => Done
AuthN POST /events => bikin event baru => Done
AuthN, AuthZ PUT /events/:eventId => edit event baru  => Done
AuthN, AuthZ DELETE /events/:eventId => delete event baru => Done

tambah column isDone di event, yang berisi true atau false, dan yang boleh mengganti hanya pembuat acara (menggunakan patch bukan put)

tambah column buat "chat token" dan tambah endpoint buat generate token chat sama token video (1 endpoint)

tambah column latitude dan longitude di event, dan buat endpoint buat cari event berdasarkan radius => di tabel event

column location diisi online atau nama lokasi


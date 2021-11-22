(Done) POST /users/register => Done
(Done) POST /users/login => Done

(Done) GET /events?search=&day=&type=online&distance=&category= // Event List 
(Done) GET /events/:eventId // Event Detail  => Done
(Done) AuthN POST /events/:eventId => user join event => Done
(Done) AuthN DELETE  /events/:eventId/participants => ganti join atau gak => Done
(Done) AuthN POST /events => bikin event baru => Done
(Done) AuthN, AuthZ PUT /events/:eventId => edit event baru  => Done
(Done) AuthN, AuthZ DELETE /events/:eventId => delete event baru => Done

(Done) tambah column isDone di event, yang berisi true atau false, dan yang boleh mengganti hanya pembuat acara (menggunakan patch bukan put)

(Done) tambah column buat "chat token" dan tambah endpoint buat generate token chat sama token video (1 endpoint)

(Done) tambah column latitude dan longitude di event, dan buat endpoint buat cari event berdasarkan radius => di tabel event

(Done) column location diisi online atau nama lokasi

(Done) 
- Column Eventn
    - isDone
    - tokenChat
    - Longitude
    - Latitude

(Done) tambah routingan fetch all category 

(Done) tambah routingan dan controller baru untuk semua my event

(Done) tambah is participant true or not, is event organizer true or not
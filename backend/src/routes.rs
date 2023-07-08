use actix::Addr;
use actix_web::{web, Error, HttpRequest, HttpResponse, cookie::time::Instant};
use actix_web_actors::ws;
use diesel::{
    prelude::*,
    r2d2::{self, ConnectionManager},
};

use crate::server;
use crate::session;

type DbPool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

pub async fn chat_server(
    req: HttpRequest,
    stream: web::Payload,
    pool: web::Data<DbPool>,
    server_to_ref: web::Data<Addr<server::ChatServer>>,
) -> Result<HttpResponse, Error> {
    ws::start(
        session::WsChatSession {
            id: 0,
            hb: Instant::now(),
            room: "main".to_string(),
            name: None,
            addr: server_to_ref.get_ref().clone(),
            db_pool: pool,
        },
        &req,
        stream,
    )
}

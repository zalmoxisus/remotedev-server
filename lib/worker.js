var path = require("path");
var app = require("express")();
var bodyParser = require("body-parser");
var cors = require("cors");
var createStore = require("./store");
var SCWorker = require("socketcluster/scworker");

class Worker extends SCWorker {
  run() {
    var store = createStore(this.options);
    this.httpServer.on("request", app);

    app.set("view engine", "ejs");
    app.set("views", path.resolve(__dirname, "..", "views"));

    app.get("*", (req, res) => {
      res.render("index", { port: this.options.port });
    });

    app.use(cors({ methods: "POST" }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.post("/", (req, res) => {
      if (!req.body) return res.status(404).end();
      switch (req.body.op) {
        case "get":
          store.get(req.body.id).then((r) => {
            res.send(r || {});
          });
          break;
        case "list":
          store.list(req.body.query, req.body.fields).then((r) => {
            res.send(r);
          });
          break;
        default:
          store.add(req.body).then((r) => {
            res.send({ id: r.id, error: r.error });
            this.scServer.exchange.publish("report", {
              type: "add",
              data: store.selectors.byBaseFields(r)
            });
          });
      }
    });

    this.scServer.addMiddleware(this.scServer.MIDDLEWARE_EMIT, (req, next) => {
      var channel = req.event;
      var data = req.data;
      if (
        channel.substr(0, 3) === "sc-" ||
        channel === "respond" ||
        channel === "log"
      ) {
        this.scServer.exchange.publish(channel, data);
      } else if (channel === "log-noid") {
        this.scServer.exchange.publish("log", { id: req.socket.id, data: data });
      }
      next();
    });

    this.scServer.addMiddleware(this.scServer.MIDDLEWARE_SUBSCRIBE, (req, next) => {
      next();
      if (req.channel === "report") {
        store.list().then((data) => {
          req.socket.emit(req.channel, { type: "list", data: data });
        });
      }
    });

    this.scServer.on("connection", (socket) => {
      var channelToWatch, channelToEmit;
      socket.on("login", (credentials, respond) => {
        if (credentials === "master") {
          channelToWatch = "respond";
          channelToEmit = "log";
        } else {
          channelToWatch = "log";
          channelToEmit = "respond";
        }
        this.exchange.subscribe("sc-" + socket.id).watch((msg) => {
          socket.emit(channelToWatch, msg);
        });
        respond(null, channelToWatch);
      });
      socket.on("getReport", (id, respond) => {
        store.get(id).then((data) => {
          respond(null, data);
        });
      });
      socket.on("close", () => {
        var channel = this.exchange.channel("sc-" + socket.id);
        channel.unsubscribe();
        channel.destroy();
        this.scServer.exchange.publish(channelToEmit, {
          id: socket.id,
          type: "DISCONNECTED"
        });
      });
    });
  }
}

new Worker();
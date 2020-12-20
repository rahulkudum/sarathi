const app = express();
app.use(express.json());

const uri = "mongodb+srv://rahul:xz7bpTm8ILa2Vwdb@cluster0.zkzfs.mongodb.net/trial3?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once("open", () => {
 gfs = Grid(connection.db, mongoose.mongo);
 gfs.collection("uploads");

 console.log("mongidb sucess");
});
const usersRouter = require("./routes/users");

app.use("/user", usersRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
 console.log(`server is running on port `);
});

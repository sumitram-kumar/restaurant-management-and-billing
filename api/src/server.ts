import "dotenv/config";
import express, { Request, Response } from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 3306,
  password: process.env.DB_PASSWORD,
  database: "billing",
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  const sqlRemove =
    "DELETE FROM stats WHERE date < DATEADD(MONTH, -6, GETDATE())";
  db.query(sqlRemove, (error, result) => {
    error && console.log(error);
    res.send(result);
  });
});

app.get("/getRates", (req: Request, res: Response) => {
  const sqlSelect = "SELECT * FROM tax";
  db.query(sqlSelect, (error, result: any) => {
    error && console.log(error);
    res.send(result[0]);
  });
});

app.get("/menu", (req: Request, res: Response) => {
  const sqlSelect = "SELECT * FROM menu ORDER BY food_name";
  db.query(sqlSelect, (error, result) => {
    error && console.log(error);
    res.send(result);
  });
});

app.get(
  "/showStats/:date1/:date2",
  (req: Request<{ date1: string; date2: string }>, res: Response) => {
    const { date1, date2 } = req.params;

    const sqlSelect1 =
      "SELECT food_name, SUM(amount) AS total_sales FROM stats WHERE date BETWEEN ? AND ? GROUP BY food_name ORDER BY total_sales DESC";
    db.query(sqlSelect1, [date1, date2], (error1, result1: any) => {
      error1 && console.log(error1);

      const sqlSelect2 =
        "SELECT SUM(subtotal) AS subtotal, SUM(discount_amount) AS discount_amount, SUM(tax_amount) AS tax_amount, SUM(final_amount) AS final_amount FROM (SELECT DISTINCT bill_no, subtotal, discount_amount, tax_amount, final_amount FROM stats WHERE date BETWEEN ? AND ? GROUP BY bill_no) AS le";
      db.query(sqlSelect2, [date1, date2], (error2, result2: any) => {
        error2 && console.log(error2);
        res.send(result2.concat(result1));
      });
    });
  }
);

app.get(
  "/editMenuItem/:food_id",
  (req: Request<{ food_id: string }>, res: Response) => {
    const { food_id } = req.params;

    const sqlSelect = "SELECT * FROM menu WHERE food_id = ?";
    db.query(sqlSelect, food_id, (error, result) => {
      error && console.log(error);
      res.send(result);
    });
  }
);

app.post("/getNewRates", (req: Request, res: Response) => {
  const { CGST, SGST } = req.body;

  const sqlTruncate = "TRUNCATE TABLE tax";
  db.query(sqlTruncate, (error) => {
    error && console.log(error);
  });

  const sqlInsert = "INSERT INTO tax (CGST, SGST) VALUES (?, ?)";
  db.query(
    sqlInsert,
    [parseFloat(CGST).toFixed(2), parseFloat(SGST).toFixed(2)],
    (error) => {
      error && console.log(error);
    }
  );
});

app.post("/addMenuItem", (req: Request, res: Response) => {
  const { food_name, category, half_price, full_price } = req.body;
  console.log({ food_name, category, half_price, full_price });

  const sqlInsert =
    "INSERT INTO menu (food_name, category, half_price, full_price) VALUES (?, ?, ?, ?)";
  db.query(
    sqlInsert,
    [food_name, category, parseInt(half_price), parseInt(full_price)],
    (error) => {
      error && console.log(error);
    }
  );
});

app.post("/billData", (req: Request, res: Response) => {
  const billData = req.body;
  const {
    bill_no,
    date,
    initial_amount,
    discount_amount,
    tax_amount,
    final_amount,
  } = billData[0];

  const sqlInsert =
    "INSERT INTO stats (date, food_name, amount, bill_no, subtotal, discount_amount, tax_amount, final_amount ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  for (let i = 1; i < billData.length; i++) {
    const { food_name, amount } = billData[i];
    db.query(
      sqlInsert,
      [
        date,
        food_name,
        amount,
        bill_no,
        initial_amount,
        discount_amount,
        tax_amount,
        final_amount,
      ],
      (error) => {
        error && console.log(error);
      }
    );
  }
});

app.delete(
  "/deleteItem/:food_id",
  (req: Request<{ food_id: string }>, res: Response) => {
    const { food_id } = req.params;
    const sqlRemove = "DELETE FROM menu WHERE food_id = ?";
    db.query(sqlRemove, food_id, (error) => {
      error && console.log(error);
    });
  }
);

app.put(
  "/editMenuItem/:food_id",
  (req: Request<{ food_id: string }>, res: Response) => {
    const { food_id } = req.params;
    const { food_name, category, half_price, full_price } = req.body;
    const sqlUpdate =
      "UPDATE menu SET food_name = ?, category = ?, half_price = ?, full_price = ? WHERE food_id = ?";
    db.query(
      sqlUpdate,
      [food_name, category, half_price, full_price, food_id],
      (error, result) => {
        error && console.log(error);
        res.send(result);
      }
    );
  }
);

app.listen(process.env.PORT || 5000, () => {
  console.log("listening at port 5000");
});

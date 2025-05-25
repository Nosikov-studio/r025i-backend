const express = require("express");
const cors = require('cors');
const app = express();
const urlencodedParser = express.urlencoded({extended: false});
app.use(express.json());
app.use(cors());
app.set("view engine", "hbs");
//***************************************** */
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
   
// установка схемы
const colltabSchema = new Schema({
    id: Number,
    name: String,
    age: Number
}, { collection: 'colltab' } );

// определяем модель User
const Colltab = mongoose.model("Colltab", colltabSchema);
//**************************************** */



async function run() {
    try {
         // Подключаемся к серверу MongoDB
        // подключемся к базе данных
    await mongoose.connect("mongodb://127.0.0.1:27017/expom");     
   // await mongoClient.connect();
    console.log("Подключение установлено");
    // получаем все объекты из БД
    const users = await Colltab.find({});
    console.log(users);


//************** */ получаем все данные в шаблон*****************
        app.get('/', async (req, res) => {
      try {
        // Получаем все документы из коллекции
       
      const us = await Colltab.find({});
          console.log(us);
        //res.status(200).json(us);
        res.render("index.hbs", {
        users: us  });

      } catch (err) {
        res.status(500).json({ message: "Ошибка при получении данных", error: err });
      }
    });
// //************** */ Вставляем запись из шаблона*****************
        app.post('/create', urlencodedParser, async (req, res) => {
      try {
        // Получаем все документы из коллекции
        
         const name = req.body.name;
         const age = req.body.age;
         const newUser = { name, age };
         const u = new Colltab(newUser);
    // добавляем объект в БД    
         await u.save();
          console.log(u);
        //res.status(200).json(us);
        res.redirect("/");

      } catch (err) {
        res.status(500).json({ message: "Ошибка при получении данных", error: err });
      }
    });


// //************** */ получаем все данные по API (json)*****************
        app.get('/api', async (req, res) => {
      try {
        // Получаем все документы из коллекции
       
      const us = await Colltab.find({});
          console.log(us);
        res.status(200).json(us);
        

      } catch (err) {
        res.status(500).json({ message: "Ошибка при получении данных", error: err });
      }
    });



//  //************** */ получаем один документ по API (json) по _id (у всех есть)*****************

// app.get('/api/:_id', async (req, res) => {
//   try {
//     const id = req.params._id;

//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Неверный формат id" });
//     }

//     const u = await collection.findOne({ _id: new ObjectId(id) });

//     if (!u) {
//       return res.status(404).json({ message: "Документ не найден" });
//     }

//     res.status(200).json(u);
//   } catch (err) {
//     res.status(500).json({ message: "Ошибка при получении данных", error: err.message });
//   }
// });
   
 

// //************** */ Вставляем документ по API *****************
        app.post('/api',urlencodedParser, async (req, res) => {
      try {
        // Получаем      

         const name = req.body.name;
         const age = req.body.age;
         const newUser = { name, age };
         const u = new Colltab(newUser);
    // добавляем объект в БД    
         await u.save();
          console.log(u);
        res.status(200).json(u);
                

      } catch (err) {
        res.status(500).json({ message: "Ошибка при получении данных", error: err });
      }
    });


// //************** */ Редактируем конкретный документ по API ***************** ЕСТЬ КОСЯК!!! (используется только id без _id)
        app.post('/api/edit',urlencodedParser, async (req, res) => {
      try {
        // Получаем      
         const id = req.body._id;
         const name = req.body.name;
         const age = req.body.age;
        

             if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Неверный формат _id" });
    }

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        name: name,
        age: age
      }
    };

    const options = { returnDocument: "after" }; // Возвращает обновленный документ
    const result = await Colltab.findOneAndUpdate(filter, updateDoc, options);
    console.log(result);
         
        res.status(200).json(result);
                

      } catch (err) {
        res.status(500).json({ message: "Ошибка при получении данных", error: err });
      }
    });



// //************** */ Удаляем документ по API *****************

        app.post('/delete/:_id',urlencodedParser, async (req, res) => {
      try {
        // Получаем      
         const id = req.params._id;
         
         if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Неверный формат _id" });
    }

    
    const result = await Colltab.findByIdAndDelete(id)
    console.log(result);
         
        res.status(200).json(result);
                

      } catch (err) {
        res.status(500).json({ message: "Ошибка при получении данных", error: err });
      }
    });



//         app.post('/delete/:_id',urlencodedParser, async (req, res) => {
//       try {
//           const id = req.params._id;
//         // Получаем все документы из коллекции
//         result = await collection.deleteOne({_id: new ObjectId(id)});
//         // res.status(200).json(us);
//         res.json(result);

//       } catch (err) {
//         res.status(500).json({ message: "Ошибка", error: err });
//       }
//     });


// Запускаем сервер только после успешного подключения к БД
        app.listen(40444, () => {
        console.log('Сервер запущен на http://localhost:40444');
        });

    }catch(err) {
        console.log(err);
    } 

}
run().catch(console.log);



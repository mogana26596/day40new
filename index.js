const express = require('express');
const mongo = require('./connect');
const dotenv = require('dotenv');

dotenv.config();
mongo.connect();
const app = express();
app.use(express.json());

app.post('/createroom', async (req,res,next) => {
    try{
        const insertedResponse = await mongo.selectedDb.collection("room").insertOne(req.body);
        res.send(insertedResponse);
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/listroom', async (req,res,next) => {
    try{
        const getData = await mongo.selectedDb.collection("room").aggregate ([{
            $lookup: {
               from: "bookedroom",
               localField: "RoomId",
               foreignField:"RoomId",
               as: "Room with booked Data"
            }
        }]) .toArray();
      res.send(getData);
    } catch(err) {
     console.error(err);
     res.status(500).send(err);
    }
});

app.post('/bookedroom',  async (req,res,next) => {

    let { customerName, bookedDate, startTime, endTime, status, roomID } = req.body;
    let startTS = Date.parse(startTime);
    let endTS = Date.parse(endTime);
    for (let i = 0; i < rooms.length;i++) {
    
    if (rooms[i].roomID === roomID) {
    
       let tobeBooked =
       {
        customerName,
        bookedDate, startTime, endTime, status, roomID
       }
       let isBooked = null;
       isBooked = rooms[i].bookedDetails.every((booking) => {
       let startBookedTS = Date.parse(booking.startTime);
       let endBookedTS = Date.parse(booking.endTime);
        return (booking.startTime !== startTime) && ((startTS > endBookedTS && endTS > endBookedTS)
        || (startTS<startBookedTS && endTS<startBookedTS))
       }
          );
       if (isBooked) 
        rooms[i].bookedDetails.push(tobeBooked)
        return res.status(200).send({ message: "Booking confirmed", rooms })
       }
    
       else
        return res.status(400).send({ message: "Already booked Room,Please Select Different Time slot" })
      }
    
});
    
app.get('/listcustomers', async (req,res,next) => {
   
    const customers = rooms.map((room) => {
        return [...room.bookedDetails,{RoomName:room.name}]
       })
      res.send(customers)
});

app.listen(process.env.PORT);
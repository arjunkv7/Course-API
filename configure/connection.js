const mongoClient=require('mongodb').MongoClient

const state={
    db:null
}

module.exports.connect=function(callback){

    const url="mongodb://localhost:27017";
    const dbname='HeroCourses';

    mongoClient.connect(url,(err,data)=>{
        if (err) return callback(err)
        state.db=data.db(dbname)
         callback()
    })
}

module.exports.get=function(){
    return state.db
}
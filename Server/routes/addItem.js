/**
 * Created by lxx on 15/11/20.
 */
var express = require('express');
var type=require("../model/typeModel");
var level=require("../model/levelModel");
var power=require("../model/powerModel");
var item=require("../model/itemModel");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    power.find({}).exec(function(err,result)
    {
        var arrPower=result;
        level.find().exec(function(err,result)
        {
            var arrLevel=result;
            type.find().exec(function(err,result)
            {
                var arrType=result;
                item.find().exec(function(err,result){
                    var arrItem =result;
                    for(var i=0;i<arrItem.length;i++)
                    {
                        var item =arrItem[i];
                        var arrAnswer =item["answer"];
                        var newAnswer=[];
                        for(var j=0;j< arrAnswer.length;j++)
                        {
                            var answer=arrAnswer[j];
                            var items=[];
                            items.push(answer.ok);
                            for(var key in answer.wrong)
                            {
                                items.push(answer.wrong[key]);
                            }
                            newAnswer.push(items);
                        }
                        item["answer"]=JSON.stringify(newAnswer);
                    }
                    res.render("addItem",{title:"添加题目",power:arrPower,level:arrLevel,type:arrType, item:arrItem});
                });
            });
        });
    });
}).post("/",function(req,res)
{
    var type=req.body.type;
    var level=req.body.level;
    var power=req.body.power;
    var content=req.body.question;
    var ansJson=req.body.answer;
    var json=[];
    for(var arr in ansJson)
    {
        var arrJson=ansJson[arr];
        var ok=arrJson[0];
        arrJson.splice(0,1);
        json.push({ok:ok,wrong:arrJson});
    }
    item.create({
        type:type,
        level:level,
        power:power,
        content:content,
        answer:json
    },function(err,result)
    {
        if(err)
        {
            console.log(err.message);
        }
        res.send("ok");
    });
}).delete("/",function(req,res){
    item.remove({_id:req.body.id},function(err){
        if(!err)
        {
            res.send("ok");
        }
    });
});
router.put("/",function(req,res){
    var ansJson=JSON.parse(req.body.answer);
    var json=[];
    for(var arr in ansJson)
    {
        var arrJson=ansJson[arr];
        var ok=arrJson[0];
        arrJson.splice(0,1);
        json.push({ok:ok,wrong:arrJson});
    }
    item.update({_id:req.body.id},{"$set" : {"content" :req.body.content,"answer":json,"type":req.body.type,"level":req.body.level,"power":req.body.power}},function(err)
    {
        if(!err)
        {
            res.send("ok");
        }
    });
    //item.remove({_id:req.body.id},function(err){
    //    if(!err)
    //    {
    //        res.send("ok");
    //    }
    //});
    //var type=req.body.type;
    //var level=req.body.level;
    //var power=req.body.power;
    //var content=req.body.question;
    //var ansJson=req.body.answer;
    //var json=[];
    //for(var arr in ansJson)
    //{
    //    var arrJson=ansJson[arr];
    //    var ok=arrJson[0];
    //    arrJson.splice(0,1);
    //    json.push({ok:ok,wrong:arrJson});
    //}
    //item.create({
    //    type:type,
    //    level:level,
    //    power:power,
    //    content:content,
    //    answer:json
    //},function(err,result)
    //{
    //    if(err)
    //    {
    //        console.log(err.message);
    //    }
    //    res.send("ok");
    //});
});
module.exports = router;

// requires Underscore.js
// requires jQuery.js

if (typeof _ === "undefined"){
    var _ = require("./Underscore");    
}

var testingObj = (function(){

    var curIndex = 0;
    
    var useConsole = false;
    
    var defaultTest = {
        desc        :"undefined test",
        url         :"/longundefinedpath/hopefully/beacusewedontwantthistopass",
        data        :{},
        method      :"get",
        testFunction: function() {return false;},
        isAjax      :false
    };
    
    var testsArray = [];
    
    
    var setDefaults = function(obj) {
        if (obj.hasOwnProperty("useConsole")) {
            if (obj.useConsole == true) {
                useConsole = true;
            }
        }
            _.extend(defaultTest, obj); //jquery
    };
    
    function addToTests(testObj) {
        if (_.isArray(testObj)) { //jquery
            for (var i = 0, testObject;testObject = testObj[i++];){ addToTests(testObject); }    
        } else {
            var test = {};
            _.extend(test,defaultTest, testObj); //jquery
            testsArray.push(test);
        }
    }
    
    
    
    function setupTests() {
        if ($("#testsDiv").length === 0) {
            $("body").append('<div id="testsDiv"></div>');    
        }
        var $tests = $("#testsDiv");
        $tests.html("");
        $tests.append('<input type="hidden" id="testing_current_index" value="0"/>');
        for (var i = 0, test; test = testsArray[i++];){
            var htmlStr = '<div class="testing_test_'+i+'">'+test.desc+'</div>';
            test.testIndex = i;
            $tests.append(htmlStr);
        }
    }
    
    function execTest(data,fun,desc) {
        updateTest(desc, getPassObj(fun(data)));
    }
    
    function getPassObj(x) {
        if (x) {
            return { color:"green", pass:"PASS", bool:true};    
        }    
        return { color:"red", pass:"FAIL", bool:false};
    }
    
    function updateTest(desc, passObj) {
        curIndex++;
        //$("#testing_current_index").val(parseInt($("#testing_current_index").val(),10) + 1);
        //$("#testsDiv").find(".testing_test_"+$("#testing_current_index").val())
        if (useConsole) {
            if (passObj.bool) {
                console.log(desc + " " + passObj.pass);    
            } else {
                //console.log(desc + " " + passObj.pass); 
                console.error(desc + " " + passObj.pass);    //doesn't work in chrome?
            }
        } else {
            $("#testsDiv").find(".testing_test_"+curIndex)
                            .css("color", passObj.color)
                            .text(desc + " " + passObj.pass);
        }
        runNextTest();
    }
    
    function runNextTest() {
        var test = {};
        if (testsArray[curIndex]) {
            test = testsArray[curIndex];
        } else {
            return true;    
        }
        if (test.isAjax) {
            $.ajax({
                //testObj:test,
                url: test.url,
                data: test.data,
                type: test.method.toUpperCase(),
                success: function (data) {execTest(data,test.testFunction, test.desc);},
                error: function () {updateTest(test.desc, getPassObj(false));}
            });
        } else {
           execTest({},test.testFunction, test.desc); 
        }
    }
    
    function runTests() {
        if (!useConsole) {
            setupTests();
        }
        runNextTest();
    }
    
    return {
        runTests : runTests,
        setDefaults : setDefaults,
        defaultTest : defaultTest,
        getTests    : testsArray,
        addToTests  : addToTests,
        setupTests  : setupTests
    };
    
    
})(); 

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = testingObj;
    }
    exports.testingObj = testingObj;
  }

//exports.testingObj = testingObj;
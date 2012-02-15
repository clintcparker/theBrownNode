var testingObj = (function(){
    
    var curIndex = 0;
    
    var defaultTest = {
        desc        :"undefined test",
        url         :"/longundefinedpath/hopefully/",
        data        :{},
        method      :"get",
        testFunction: function() {return false;}
    };
    
    var testsArray = [];
    
    
    var setDefaults = function(obj) {
            $.extend(defaultTest, obj);
    };
    
    function addToTests(testObj) {
        if ($.isArray(testObj)) {
            for (var i = 0, testObject;testObject = testObj[i++];){ addToTests(testObject); }    
        } else {
            var test = {};
            $.extend(test,defaultTest, testObj);
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
            return { color:"green", pass:"PASS"};    
        }    
        return { color:"red", pass:"FAIL"};
    }
    
    function updateTest(desc, passObj) {
        curIndex++;
        //$("#testing_current_index").val(parseInt($("#testing_current_index").val(),10) + 1);
        //$("#testsDiv").find(".testing_test_"+$("#testing_current_index").val())
        $("#testsDiv").find(".testing_test_"+curIndex)
                        .css("color", passObj.color)
                        .text(desc + " " + passObj.pass);
        runNextTest();
    }
    
    function runNextTest() {
        var test = {};
        if (testsArray[curIndex]) {
            test = testsArray[curIndex];
        } else {
            return true;    
        }
        $.ajax({
            //testObj:test,
            url: test.url,
            data: test.data,
            type: test.method.toUpperCase(),
            success: function (data) {execTest(data,test.testFunction, test.desc);},
            error: function () {updateTest(test.desc, getPassObj(false));}
        });
    }
    
    function runTests() {
        setupTests();
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
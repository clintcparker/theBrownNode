var testingObj = (function(){
    
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
        var test = {};
        $.extend(test,defaultTest, testObj);
        testsArray.push(test);
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
        var color = "red",
            pass = "FAIL";
        if (fun(data)) {
            color = "green";
            pass = "PASS";
        }
        updateTest(desc, color, pass);
    }
    
    function updateTest(desc, color, pass) {
        $("#testing_current_index").val(parseInt($("#testing_current_index").val(),10) + 1);
        $("#testsDiv").find(".testing_test_"+$("#testing_current_index").val())
                        .css("color", color)
                        .text(desc + " " + pass);
        runNextTest();
    }
    
    function runNextTest() {
        var test = {};
        if (testsArray[$("#testing_current_index").val()]) {
            test = testsArray[$("#testing_current_index").val()];
        } else {
            return true;    
        }
        $.ajax({
            testObj:test,
            url: test.url,
            data: test.data,
            type: test.method.toUpperCase(),
            success: function (data) {execTest(data,test.testFunction, test.desc);},
            error: function () {updateTest(test.desc, "red", "FAIL");}
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
$(document)
    .ready(function () {


        var isRequestFinished = true;
        var imgurEasterEgg = false;
		var pcMasterRaceEgg = false;

        function disableForm() {
            var form = document.forms['filters'];
            var elements = form.elements;
            for (var i = 0, len = elements.length; i < len; ++i) {
                elements[i].disabled = true;

            }
        }

        function enableForm() {
            var form = document.forms['filters'];
            var elements = form.elements;
            for (var i = 0, len = elements.length; i < len; ++i) {
                elements[i].disabled = false;

            }
        }

        function donateTo() {
            var donate = localStorage.donate;
            if (typeof donate === 'undefined') {
                localStorage.donate = "false";
            };
            if (donate === "false") {
                localStorage.donate = "true";
                alertMessage("For the next 48 hours we're raising money in honour of our good friend who passed away to start a scholarship in his name, every penny counts. ");
            }
        }

        function repopulate() {
            var dirty_bit = document.getElementById('dirty');
            if (dirty_bit.value == '1') {
                updatePage(Base64.decode(localStorage.results));

            }
        }


        function alertMessage(str) {
            var dialog = new BootstrapDialog({
                message: str,
                buttons: [{
                    id: 'btn-1',
                    label: 'Donate!'
            }]
            });
            dialog.realize();
            var btn1 = dialog.getButton('btn-1');
            btn1.click({
                'name': 'Apple'
            }, function (event) {
                var link = "http://igg.me/at/rememberalex/x/3590458";
                window.open(link);
            });
            dialog.open();
        }
	

        function remoteSearch() {
            if (isRequestFinished) {
                isRequestFinished = false;
                var xmlHttpReq = false;
                var self = this;
                // Mozilla/Safari
                if (window.XMLHttpRequest) {
                    self.xmlHttpReq = new XMLHttpRequest();
                }
                // IE
                else if (window.ActiveXObject) {
                    self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
                }
                self.xmlHttpReq.open('POST', "core/callSearchEngine.php", true);
                self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                self.xmlHttpReq.onreadystatechange = function () {
                    if (self.xmlHttpReq.readyState == 4) {
                        $('#loadingicon')
                            .hide();
                        var dirty_bit = document.getElementById('dirty');
                        dirty_bit.value = '1';
                        var text = self.xmlHttpReq.responseText;
                        updatePage(text);
                        if (text != "Please enter a search phrase.." && text != "No torrents could be found...") {

                            localStorage.results = Base64.encode(text);
                        }
                        isRequestFinished = true;

                        //  enableForm();

                    }
                };
                var searchQuery = getQuery();
                if (searchQuery.toLowerCase()
                    .indexOf("imgur") > -1 || searchQuery.toLowerCase()
                    .indexOf("reddit") > -1 && imgurEasterEgg == false) {
                    $("body")
                        .append("<iframe id=\"catfinder\" src=\"https://getstrike.net/torrents/catfinder/\" width=\"320\" height=\"430\" style=\"position:fixed;bottom:0px;right:10px;z-index:100\" frameBorder=\"0\"></iframe>");
                    $("#catfinder")
                        .fadeIn("slow");
                    imgurEasterEgg = true;
                } 
				var newStr = searchQuery.replace(/\s+/g, '');
			
				 if (newStr.toLowerCase()
                    .indexOf("halflife3") > -1 || newStr.toLowerCase()
                    .indexOf("pcmasterrace") > -1 && pcMasterRaceEgg == false) {
			
					$("body")
					
                        .append("<img id=\"gaben\" src=\"https://getstrike.net/torrents/assets/img/closeupgaben.png\" alt=\"gaben\" style=\"width:640px;height:353px;position:fixed;bottom:0px;right:10px;z-index:100\">");
						 $("#gaben")
                        .fadeIn("slow");
                    pcMasterRaceEgg = true;
				}
                self.xmlHttpReq.send(searchQuery);

                return false;
            }
        }

        function getQuery() {
            var form = document.forms['filters'];
            var query = form.phrase.value;
            if (isEmpty(query)) {
                return "";
            }
            var squery = 'query=' + encodeURIComponent(query.trim());
            return squery; // NOTE: no '?' before querystring
        }

        function isEmpty(str) {
            return (!str || 0 === str.length);
        }

        function donatePrompt() {

            var dialog = new BootstrapDialog({
                message: 'This project is not for profit, there will never be advertisements <br>If you wish to donate to help with hosting/API maintaining cost you can do so <br>Below is a button that will take you to paypal, alternatively our bitcoin address is 1DpnZFPikokWwab4muVbjUXZDAD25DhXj3',
                buttons: [{
                    id: 'btn-1',
                    label: 'Donate via Paypal'
            }]
            });
            dialog.realize();
            var btn1 = dialog.getButton('btn-1');
            btn1.click({
                'name': 'Apple'
            }, function (event) {
                var link = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TWHNPSC7HRNR2";
                window.open(link);
            });
            dialog.open();

        }

        function updatePage(str) {

            document.getElementById("data")
                .innerHTML = str;
            $('#data')
                .hide()
                .fadeIn('slow');
            $('#stats')
                .hide()
                .fadeIn('slow');
            $('#results')
                .hide()
                .fadeIn('slow');
            $.bootstrapSortable(true);
        }

        function search() {
            //  disableForm();
            remoteSearch();
        }

        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[")
                .replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        function setup() {
            $('#loadingicon')
                .hide();
            $("#search")
                .bind("click", function () {
                    $("#searchform")
                        .submit();
                });

            $("#searchform")
                .submit(function (e) {
                    $('#loadingicon')
                        .hide()
                        .fadeIn('slow');
                    $('#data')
                        .hide();
                    e.preventDefault();
                    search();
                });


            $(document)
                .on("click", "#bars", function (e) {
                    $('#table')
                        .toggleClass('table-condensed');
                });
            $(document)
                .on("click", "#donate", function (e) {
                    donatePrompt();
                });
            $(document)
                .on("click", "#toggle-lock", function (e) {
                    $("i", this)
                        .toggleClass('fa-lock fa-unlock');
                });

            $(document)
                .on("click", ".clickable-row", function (e) {
                    window.document.location = $(this)
                        .data("href");
                });




            var localquery = localStorage.query;
            if (!isEmpty(localquery)) {
                $('#phrase')
                    .val(localquery);
                $('#loadingicon')
                    .hide()
                    .fadeIn('slow');
                $('#data')
                    .hide();
                search();
                localStorage.query = "";
            }
            var getQuery = getParameterByName('q');
            if (!isEmpty(getQuery)) {
                $('#phrase')
                    .val(getQuery);
                $('#loadingicon')
                    .hide()
                    .fadeIn('slow');
                $('#data')
                    .hide();
                search();
            }
        }
        setup();
        repopulate();
        donateTo();

        function receiveMessage(event) {
            if (event.data == "removetheiframe") {
                var iframes = document.getElementsByTagName('iframe');
                for (var i = 0; i < iframes.length; i++) {
                    iframes[i].parentNode.removeChild(iframes[i]);
                }

            }
        }
        window.addEventListener("message", receiveMessage, false);
    });

var obj;
var session_id_autocaptura = '';
var id_front = '';
var id_back = '';
var selfie = '';
var docType = '';
var app_locale = '';
var idioma = '';

$("#tableMenu a").click(function(e){
    $('.loading').show();
    e.preventDefault(); // cancel the link behaviour
    var selText = $(this).find('span').attr("data-localize");//.text().trim();
    $("dropdownMenu1").text(selText);
    if(selText.includes("CHL1"))
    {
        docType =  'CHL1';
    }
    else if(selText.includes("CHL2"))
    {
        docType =  'CHL2';
    }
    else if(selText.includes("PER1"))
    {
        docType =  'PER1';
    }
    else if(selText.includes("PER2"))
    {
        docType =  'PER2';
    }
    else if(selText.includes("COL1"))
    {
        docType =  'COL1';
    }
    console.log(selText);
    document.getElementById("dropdownMenu1").innerHTML = selText;
    goesToFront(e);
    document.getElementById('autocaptura').hidden = false;
  });

 //funcion que redirige a autocaptura front  
function goesToFront(e) { 
    e.preventDefault();
    console.log("entro autoCaptureFront");
    document.getElementById("textSelect").innerHTML = "";
    var form_data = new FormData();
                 form_data.append('autocapture', true);
                 $('.loading').hide();
                 $.ajax({
                     url: 'autocapture.php',
                     async: true,
                     crossDomain: true,
                     processData: false,
                     contentType: false,
                     type: 'POST',
                     data: form_data
                 })
                 .done(function(data) {
                    $("#autoCaptureFront").empty();
                     obj = JSON.parse(data);
                     session_id_autocaptura = obj.session_id;
                     autoCaptureFront(session_id_autocaptura);
                     document.getElementById("front").hidden = false;
                     document.querySelector('.footerToc').style.position= "inherit";
                     console.log("autoCaptureFront ok");
                     setTimeout(function(){ 
                       window.scrollTo(0,document.body.scrollHeight);
                     }, 1000);
                 }).fail(function(data) {
                     console.log(data);
                     console.log("error");
                 });
}

//funcion que redirige a autocaptura back 
function goesToBack() { 
    console.log("entro autoCaptureBack");
    $('.loading').hide(); 
    var form_data = new FormData();
                 form_data.append('autocapture', true);
                 $.ajax({
                     url: 'autocapture.php',
                     async: true,
                     crossDomain: true,
                     processData: false,
                     contentType: false,
                     type: 'POST',
                     data: form_data
                 })
                 .done(function(data) {
                    $("#autoCaptureBack").empty();
                     obj = JSON.parse(data);
                     console.log(obj.session_id);
                     autoCaptureBack(session_id_autocaptura);
                     document.getElementById("front").hidden = true;
                     document.getElementById("back").hidden = false;
                     console.log("autoCaptureBack ok");
                     setTimeout(function(){ 
                        window.scrollTo(0,document.body.scrollHeight);
                     }, 1000);
                 }).fail(function(data) {
                     console.log(data);
                     console.log("error");
                 });

};

//funcion que dirige a liveness para tomarse la foto selfie
function goesToLiveness() { 
    console.log("entro autoCaptureSelfie");
    //document.getElementById("textByPhoto").remove();
    document.getElementById("back").hidden = true;
    document.getElementById("textByLiveness").hidden = false;
    $('.loading').hide(); 
    var form_data = new FormData();
                 form_data.append('liveness', true);
                 $.ajax({
                     url: 'liveness.php',
                     async: true,
                     crossDomain: true,
                     processData: false,
                     contentType: false,
                     type: 'POST',
                     data: form_data
                 })
                 .done(function(data) {
                     obj = JSON.parse(data);
                     console.log("termino ok");
                     setTimeout(function(){ 
                        window.scrollTo(0,document.body.scrollHeight);
                     }, 1000);
                     TOCliveness('liveness', {
                        locale: idioma,
                        http: true,
                        session_id: obj.session_id,
                       callback: function(token){ 
                        selfie = token;
                        document.getElementById("liveness").remove();
                        document.getElementById('imgOkFace').hidden = false;
                        if(idioma == "es")
                        {
                        Swal.fire({
                            type: 'success',
                            title: 'Captura Exitosa!',
                            showConfirmButton: false,
                            timer: 2000
                        }).then(() => {
                            $('#fff').click();
                        })
                        }
                        else
                        {
                            Swal.fire({
                                type: 'success',
                                title: 'Successful Capture!',
                                showConfirmButton: false,
                                timer: 2000
                            }).then(() => {
                                $('#fff').click();
                            })
                        }
                        goesToValid();// gatilla la validacion despues se hacer liveness
                       }
                    }
                    );
                 }).fail(function(data) {
                    console.log("error");
                     console.log(data);
                     
                 });

};

//funcion que levanta autocaptura front con los parametros necesarios
function autoCaptureFront(session_id) {
    $('#container').autocapture({
        locale: idioma,
        session_id: session_id,
        document_type: docType,
        document_side: "front",
        http: true,
        callback: function(captured_token, image){ 
            id_front = captured_token
            console.log(id_front);
            if(idioma == "es")
            {
            Swal.fire({
                type: 'success',
                title: 'Captura Exitosa!',
                showConfirmButton: false,
                timer: 2000
              }).then(() => {
                $('#fff').click();
              })
            }
            else
            {
                Swal.fire({
                    type: 'success',
                    title: 'Successful Capture!',
                    showConfirmButton: false,
                    timer: 2000
                  }).then(() => {
                    $('#fff').click();
                })
            }
            $('.loading').show(); 
            document.getElementById('imgOkFront').hidden = false;
            goesToBack();
        },
        failure: function(error){ 
            location.reload();
        }
    }
    );
}
//funcion que levanta autocaptura back con los parametros necesarios
function autoCaptureBack(session_id) {
    $('#container').autocapture({
        locale: idioma,
        session_id: session_id_autocaptura,
        document_type: docType,
        document_side: "back",
        http: true,
        callback: function(captured_token, image){
            id_back = captured_token
            console.log(id_back);
            if(idioma == "es")
            {
            Swal.fire({
                type: 'success',
                title: 'Captura Exitosa!',
                showConfirmButton: false,
                timer: 2000
              }).then(() => {
                $('#fff').click();
              })
            }
            else
            {
                Swal.fire({
                    type: 'success',
                    title: 'Successful Capture!',
                    showConfirmButton: false,
                    timer: 2000
                  }).then(() => {
                    $('#fff').click();
                })
            }
            $('.loading').show();  
            document.getElementById('imgOkBack').hidden = false;
            document.getElementById("autocaptura").remove();
            goesToLiveness();
        },
        failure: function(error){ 
            location.reload();
        }
    }
    );
}

// funcion que valida las 3 fotos tomadas en los pasos anteriores y obtiene el callback de respuesta del servicio.
function goesToValid() { 
    console.log("entro validar");
    $('.loading').show();
    var data_valid = false;
    if (id_front.length > 0 && id_back.length > 0 && selfie.length > 0) {
        data_valid = true;
    }
    if (data_valid) {
    var form_data = new FormData();
        form_data.append('documentType', docType);
        form_data.append('selfie', selfie); // Raw bytes of the photo
        form_data.append('id_front', id_front); // Raw bytes of the photo
        form_data.append('id_back', id_back); // Raw bytes of the photo
                 $.ajax({
                     url: 'consumo.php',
                     async: true,
                     crossDomain: true,
                     processData: false,
                     contentType: false,
                     type: 'POST',
                     data: form_data
                 })
                 .done(function(data) {
                    document.getElementById("dropdownMenu1").style.visibility = "hidden";
                    document.getElementById("dropdownMenu1").remove();
                    document.getElementById("textByLiveness").remove();
                    document.getElementById("restart").hidden = false;
                    var result_text = '';
                    var result_text_locale = '';
                    var mrz = null;
                    var type = null;
                     console.log(data);
                     obj = JSON.parse(data);
                     console.log(obj.status);
                     if (obj.status == '200') {
                         console.log("es 200");
                         $("#toc_token").text(obj.toc_token);
                        if (typeof(obj["information from document"]) != 'undefined' && obj["information from document"].length != 0) {
                            mrz = (typeof(obj["information from document"]).mrz != 'undefined') ? obj["information from document"].mrz : null;
                            type = obj["information from document"].type;
                            if (parseFloat(obj["biometric result"]) > 1) {
                                console.log("entro biometric result mayor a 1");
                                result_class = 'text-success';
                                result_text = lang[app_locale]['positive'];
                                result_text_locale = 'positive';
                                $('.match .card-body .positive').show();
                                $("#rut").text(obj["information from document"].mrz.data["national identification number"]);
                                $("#serial-number").text(obj["information from document"].mrz.data["document number"]);
                                $("#names").text(obj["information from document"].mrz.data["name"]);
                                $("#lastnames").text(obj["information from document"].mrz.data["family name"]);
                                $("#gender").text(obj["information from document"].mrz.data["gender"]);
                                $("#country").text(obj["information from document"].mrz.data["nationality"]);
                                $("#date-birth").text(obj["information from document"].mrz.data["date of birth"]);
                                $("#expire-date").text(obj["information from document"].mrz.data["expiration date"]);
                                $('.info-doc').show();
                            } else if (parseFloat(obj["biometric result"]) == 1) {
                                console.log("entro biometric result igual a 1");
                                result_class = 'text-success';
                                result_text = lang[app_locale]['positive'];
                                result_text_locale = 'positive';
                                $('.match .card-body .positive').show();
                                console.log(obj["information from document"].mrz);
                                console.log(obj["information from document"].mrz.data);
                                console.log(obj["information from document"].mrz.data["national identification number"]);
                                $("#rut").text(obj["information from document"].mrz.data["national identification number"]);
                                $("#serial-number").text(obj["information from document"].mrz.data["document number"]);
                                $("#names").text(obj["information from document"].mrz.data["name"]);
                                $("#lastnames").text(obj["information from document"].mrz.data["family name"]);
                                $("#gender").text(obj["information from document"].mrz.data["gender"]);
                                $("#country").text(obj["information from document"].mrz.data["nationality"]);
                                $("#date-birth").text(obj["information from document"].mrz.data["date of birth"]);
                                $("#expire-date").text(obj["information from document"].mrz.data["expiration date"]);
                                $('.info-doc').show();
                            } else if (parseFloat(obj["biometric result"]) < 0) {
                                console.log("entro biometric result menos a 0");
                                result_class = 'text-danger';
                                result_text = lang[app_locale]['no_face'];
                                result_text_locale = 'no_face';
                                $('.match .card-body .negative').show();
                                $('.info-doc').hide();
                            } else if (parseFloat(obj["biometric result"]) == 0) {
                                console.log("entro biometric result igual a 0");
                                result_class = 'text-danger';
                                result_text = lang[app_locale]['negative'];
                                result_text_locale = 'negative';
                                $('.match .card-body .negative').show();
                                $('.info-doc').hide();
                            }
                            $('.card.match .card-body h5 span.confidence').append(result_text).addClass(result_class).attr('data-localize', result_text_locale);
                            document.getElementById('uiDivDialogResponse').hidden = false;
                        }
                     }
                     else
                     {
                        console.log("error de API");
                        if (obj.status == '201') {
                             displayErrorApi(false, false, false);
                        } else if (obj.status == '202') {
                           displayErrorApi(false, true, true);
                        } else if (obj.status == '203') {
                            displayErrorApi(false, false, false);
                        } else if (obj.status == '431') {
                            displayErrorApi(false, false, false);
                        } else {
                            displayErrorApi(false, false, false);
                        }
                        (typeof(obj.toc_token) != 'undefined') ? $('h6.token span.badge-light').text(obj.toc_token) : '';
                     }
                     console.log("termino ok");
                    
                     $('.loading').hide();
                     
                 }).fail(function(data) {
                     console.log(data);
                     console.log("error");
                 });

        console.log("termino proceso ok");         
    } 
};

$( document ).ready(function() {
    console.log( "ready!" );
    idioma = 'es';
    $("html,body").animate({scrollTop: 0}, 1000); 
    document.querySelector('#tableMenu').style.transform = "translate3d(20px, -426px, 0px)";
    app_locale = setLanguage();
    console.log(app_locale);
    /*var documents = [
        {
            value: 'CHL1', 
            name: 'Cédula antigua',
            imageSrc: "../facial/img/cl.png"
        },
        {
            value: 'CHL2', 
            name: 'Cédula nueva',
            imageSrc: "../facial/img/cl.png"
        },
        {
            value: 'PER1', 
            name: 'Cédula nueva',
            imageSrc: "../facial/img/cl.png"
        },
        {
            value: 'PER2', 
            name: 'Cédula nueva',
            imageSrc: "../facial/img/cl.png"
        },
        {
            value: 'COL1', 
            name: 'Cédula nueva',
            imageSrc: "../facial/img/cl.png"
        }
    ];
    let dropdown = $('#tableMenu');
    dropdown.empty();
    $.each(documents, function(key, entry) {
      dropdown.append($('<a class="dropdown-item"></a>').attr('value', entry.value).text(entry.name));
    });*/
    $('.loading').hide();
});


$("#restart").click(function(){
    location.reload();
});

function displayErrorApi(frontStatus, backStatus, selfieStatus) {
    errorCount = 0;
    ok_class = 'fa fa-check fa-fw text-success';
    error_class = 'fa fa-times fa-fw text-danger';
    $('#error_facial .modal-body ul.errorPhoto li span i').removeClass();
    if (frontStatus) {
        $('#error_facial .modal-body ul.errorPhoto li.front i').addClass(ok_class);
        $('#error_facial .modal-body ul.errorPhoto li.front a').hide();
    } else {
        $('#error_facial .modal-body ul.errorPhoto li.front i').addClass(error_class);
        $('#error_facial .modal-body ul.errorPhoto li.front a').show();
        errorCount++;
    }
    if (backStatus) {
        $('#error_facial .modal-body ul.errorPhoto li.back i').addClass(ok_class);
        $('#error_facial .modal-body ul.errorPhoto li.back a').hide();
    } else {
        $('#error_facial .modal-body ul.errorPhoto li.back i').addClass(error_class);
        $('#error_facial .modal-body ul.errorPhoto li.back a').show();
        errorCount++;
    }
    if (selfieStatus) {
        $('#error_facial .modal-body ul.errorPhoto li.selfie i').addClass(ok_class);
        $('#error_facial .modal-body ul.errorPhoto li.selfie a').hide();
    } else {
        $('#error_facial .modal-body ul.errorPhoto li.selfie i').addClass(error_class);
        $('#error_facial .modal-body ul.errorPhoto li.selfie a').show();
        errorCount++;
    }
    $('#errorPhotoCount').text(errorCount);
    $( '#error_facial').modal('show');
}

$("#en").click(function(){
    var language = "en";
    idioma = language;
    app_locale = idioma;
    $('button[data-lang="' + language + '"]').addClass('btn-dark');
    setLocale(language);
    
});

$("#es").click(function(){
    var language = "es"
    idioma = language;
    app_locale = idioma;
    $('button[data-lang="' + language + '"]').addClass('btn-dark');
    setLocale(language);
});

function setLanguage() {
    var language = navigator.language.split('-');
    if (language[0] != 'es' && language[0] != 'en') {
        language[0] = 'en';
    }
    $('button[data-lang="' + language[0] + '"]').addClass('btn-dark');
    setLocale(language[0]);
    return language[0];
}

//funcion que cambia el lenguaje que seleciona el usuario
function setLocale(locale) {
    $('input[name="lang"]').val(locale);
    $('.checkbox .col-form-label span').text(' ' + lang[locale]['all_documents']);
    var path_prefix = 'locale/';
    if (window.location.href.indexOf('consorcio') >= 0) {
        path_prefix = '../locale/';
    }
    var opts = { language: locale, pathPrefix: path_prefix, skipLanguage: 'es-CL' };
    $('[data-localize]').localize('app', opts);
    getGeoCountry(locale);
}

function setTemplateCountry(country = '') {
    var base_image = '';
    base_image = (window.location.href.indexOf('cmr') !== -1) ? '../img/' : 'img/';
    switch (country) {
        case 'Chile':
            $('img#id_front').attr({src: base_image + 'ci_front.png'});
            $('img#id_back').attr({src: base_image + 'ci_back.png'});
        break;
        case 'Peru':
            $('img#id_front').attr({src: base_image + 'dni_front_peru.png'});
            $('img#id_back').attr({src: base_image + 'dni_back_peru.png'});
        break;
        case 'Colombia':
            $('img#id_front').attr({src: base_image + 'ci_front_col.png'});
            $('img#id_back').attr({src: base_image + 'ci_back_col.png'});
        break;
        default:
            $('img#id_front').attr({src: base_image + 'front.png', style: 'margin: 1%;width:35%;'});
            $('img#id_back').attr({src: base_image + 'back.png', style: 'margin: 1%;width:35%;'});
    }
    $('img#selfie').attr({src: base_image + 'selfie.png', style: 'margin: 1%;width:20%;'});
}
// Función que busca la ubicación geografica del usuario
function getGeoCountry(locale) {
    var country = '';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $.ajax('https://maps.googleapis.com/maps/api/geocode/json?latlng='
            + position.coords.latitude + ','
            + position.coords.longitude)
            .done(function(data, textStatus, jqXHR) {
                if ( textStatus === 'success' && typeof data.results != 'undefined') {
                    var country = null, countryCode = null;
                    for (var r = 0, rl = data.results.length; r < rl; r += 1) {
                        var result = data.results[r];
                        if (!country && result.types[0] === 'country') {
                            country = result.address_components[0].long_name;
                            countryCode = result.address_components[0].short_name;
                        }
                    }
                }
                console.log(country);
                if (DetectRTC.isMobileDevice) {
                    setTemplateCountry(country);
                }
                setCountryOptions(country, locale);
            });
        });
    } else {
        if (DetectRTC.isMobileDevice) {
            setTemplateCountry(country);
        }
        setCountryOptions(country, locale);
    }
}

function setTemplateCountry(country = '') {
    var base_image = '';
    base_image = (window.location.href.indexOf('cmr') !== -1) ? '../img/' : 'img/';
    switch (country) {
        case 'Chile':
            $('img#id_front').attr({src: base_image + 'ci_front.png'});
            $('img#id_back').attr({src: base_image + 'ci_back.png'});
        break;
        case 'Peru':
            $('img#id_front').attr({src: base_image + 'dni_front_peru.png'});
            $('img#id_back').attr({src: base_image + 'dni_back_peru.png'});
        break;
        case 'Colombia':
            $('img#id_front').attr({src: base_image + 'ci_front_col.png'});
            $('img#id_back').attr({src: base_image + 'ci_back_col.png'});
        break;
        default:
            $('img#id_front').attr({src: base_image + 'front.png', style: 'margin: 1%;width:35%;'});
            $('img#id_back').attr({src: base_image + 'back.png', style: 'margin: 1%;width:35%;'});
    }
    $('img#selfie').attr({src: base_image + 'selfie.png', style: 'margin: 1%;width:20%;'});
}

// Función que despliega los tipos de documentos por país
function setCountryOptions(country, locale) {
    $('#documentType').find('option').remove();
    var ci_codes = '';
    if (locale === 'es') {
        ci_codes = ci_codes_es;
    } else if (locale === 'en') {
        ci_codes = ci_codes_en;
    }
    if (typeof country != 'undefined' && country != '' && country != null && country.length > 0) {
        $('label[for="documentType"]').text(lang[app_locale]['document_type'] + ' ' + country);
        // set especific options
        $.each(ci_codes, function(index, element) {
            if (element.hasOwnProperty(country)) {
                $.each(element[country], function(index, item) {
                    $('#documentType').append($('<option>', {
                        value: item.value,
                        text : item.name
                    }));
                });
            }
        });
    } else {
        // set all options
        $('label[for="documentType"]').text(lang[app_locale]['document_type'] + ' : ');
        $('#documentType').append($('<option>', {
            value: 0,
            text : lang[app_locale]['select_document']
        }));
        $.each(ci_codes, function(index, element) {
            for (var key in element) {
                $.each(element[key], function(index, item) {
                    if (item.value != 0) {
                        $('#documentType').append($('<option>', {
                            value: item.value,
                            text : item.name + ' ' + key
                        }));
                    }
                });
            }
        });
    }
}


$(document).ready(()=>{
    // Modal Tambah
    $("#open_tambah").click((e)=>{
        e.preventDefault();
        $("#modal_tambah").removeClass("hidden");
    });
    $("#close_tambah").click((e)=>{
        e.preventDefault();
        $("#modal_tambah").addClass("hidden");
    });
    // End Modal Tambah

    // Modal Update
    $("#open_update").click((e)=>{
        e.preventDefault();
        $("#modal_update").removeClass("hidden");
    });
    $("#close_update").click((e)=>{
        e.preventDefault();
        $("#modal_update").addClass("hidden");
    });
    // End Modal Update


    //Socket
    // const socket = io.connect('http://localhost:3030/', {path: '/socket.io'});
    // const socket = io();
    // socket.on('msg',(msg)=>{
    //     $('#logs').append($('<li class="font-bold">').text(msg));
    // });

    // $('#qrcode').hide();
    // socket.on('qrcode',(src)=>{
    //     $('#qrcode').attr('src',src);
    //     $('#qrcode').show();
    // });

    // socket.on('status',(status)=>{
    //     const stswa = $("#status-wa");
    //     if(status=="0"){
    //         stswa.css({"background-color":"red"});
    //     }else{
    //         stswa.css({"background-color":"green"});
    //         $('#qrcode').hide();
    //     }
    // });

    $("#togle-nav").click((e)=>{
        e.preventDefault();
        const side=$("#sidebar");
        if(window.matchMedia("(min-width: 768px)").matches){
            if($("#sidebar").hasClass("md:block")){
                side.removeClass("md:block").addClass("md:hidden");
            }else{
                side.removeClass("md:hidden").addClass("md:block");
            }
        }else{
            if($("#sidebar").hasClass("hidden")){
                side.removeClass("hidden").addClass("block");
            }else{
                side.removeClass("block").addClass("hidden");
            }
        }
    });
});

const edit_pengaturan=(id, nomor, nama, role)=>{
    // id="open_update"
    $("#id").val(id);
    $("#nomor_handphone").val(nomor);
    $("#nama").val(nama);
    $("#role").val(role);
    $("#modal_update").removeClass("hidden");
}
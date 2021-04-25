const express = require('express');
const app = express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

app.use('/resources',express.static('public'));
app.use('/resources',express.static(__dirname + 'public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const bcrypt = require('bcryptjs');

const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized:true,
}));

//Conexion a la BD

const connection = require('./database/db');
const { Router } = require('express');

//Rutas

app.get('/',(req, res)=>{
    res.render('index');
})

app.get('/principal',(req, res)=>{
    res.render('principal')
})

app.get('/login',(req, res) =>{
    res.render('login')
})


//Registros
app.post('/registro', async (req, res) =>{
    const correo = req.body.correo;
    const pass = req.body.pass;
    const conpass = req.body.conpass;
    const name = req.body.name;
    var hoy = new Date();
    var fecha = hoy.getFullYear()+'/'+(hoy.getMonth()+1)+'/'+hoy.getDate();
    console.log(fecha);
    if (pass == conpass) {
          //let passwordHaash = await bcrypt.hash(pass, 8);
          connection.query('INSERT INTO usuarios SET ?', {email_user:correo , pws_user:pass , name_user:name, date_user:fecha}, async(error,results)=>{
            if(error){
               console.log("Error");
            }else{
                res.render('registro',{
                    alert: true,
                    alertTitle: "Registro",
                    alertMessage: "¡Registro Exitoso!",
                    alertICon: 'Success',
                    showConfirmButton:true,
                    timer:1500,
                    ruta:'login'
                })
            }
          })
    }else{ 
        res.render('registro',{
            alert: true,
            alertTitle: "Registro",
            alertMessage: "¡El Registro Fallo! Las contraseñas no coinciden",
            alertICon: 'error',
            showConfirmButton:true,
            timer:3000,
            ruta:'registro'
        })
    }
})


//Autenticacion
app.post('/auth', async (req, res)=>{
    const correo = req.body.correo;
    const pass = req.body.pass;
    const dateU = new Date();
    //let passwordHash = await bcrypt.hash(pass, 8);
    if (correo && pass) {
        connection.query('SELECT * FROM usuarios WHERE email_user = ? AND pws_user = ?', [correo, pass], async (error, results, fields) => {
            if(results.length > 0){
                connection.query('UPDATE usuarios SET lastlogin_user = ? WHERE email_user = ?',[dateU,correo]);
                req.session.loggedin = true;                
				req.session.name_user = results[0].name_user;
				res.render('login', {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡LOGIN CORRECTO!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: 'dashboard'
				}); 
            }else{
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "USUARIO y/o PASSWORD incorrectas",
                    alertIcon:'error',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'login'    
                });
            }
        })
    }else{
        res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Ingrese un correo y/o contrasela",
            alertIcon:'error',
            showConfirmButton: false,
            timer: 1500,
            ruta: 'login'    
        });
    }
})

//Agregar tarea pendiente
app.post('/tareasP', async (req, res) =>{
    const tareaP = req.body.tareaP;
    const estado = 1;
    connection.query('INSERT INTO tareas SET ?',{name_chores:tareaP , status_chores:estado} , async(error,results)=>{
        res.redirect('/tareasP');
    });
});


//Agregar tarea realizada
app.post('/tareasR', async (req, res) =>{
    const tareaP = req.body.tareaP;
    const estado = 2;
    connection.query('INSERT INTO tareas SET ?',{name_chores:tareaP , status_chores:estado} , async(error,results)=>{
        res.redirect('/tareasR');
    });
});

//Consulta de usuarios registrados

app.get('/usuarios',function(req, res, next){
    connection.query('SELECT * FROM usuarios',function(err,rs){
        res.render('usuarios',{usuarios: rs});
    });
});

//Consulta de tareas realizadas
app.get('/tareasR',function(req, res, next){
    connection.query('SELECT * FROM tareas WHERE status_chores = 2',function(err,rs){
        res.render('tareasR',{tareas: rs});
    });
});

//Consulta de tareas pendientes
app.get('/tareasP',function(req, res, next){
    connection.query('SELECT * FROM tareas WHERE status_chores = 1',function(err,rs){
        res.render('tareasP',{tareas: rs});
    });
});

//-------------------------

app.get('/dashboard', (req, res)=> {
	if (req.session.loggedin) {
		res.render('dashboard',{
			login: true,
			name: req.session.name_user			
		});		
	} else {
		res.render('dashboard',{
			login:false,
			name:'Debe iniciar sesión',			
		});				
	}
	res.end();
});

//función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.name_user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 //Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});

//-----------------------------

app.listen(3000, (req, res) =>{
    console.log('Server corriendo en http://localhost:3000');
})
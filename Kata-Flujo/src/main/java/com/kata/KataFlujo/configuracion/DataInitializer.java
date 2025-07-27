package com.kata.KataFlujo.configuracion;

import com.kata.KataFlujo.modelo.Usuario;
import com.kata.KataFlujo.modelo.RolUsuario;
import com.kata.KataFlujo.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Override
    public void run(String... args) throws Exception {
        // Solo inicializar si no hay usuarios
        if (usuarioRepositorio.count() == 0) {
            System.out.println("🔄 Inicializando datos de prueba...");
            
            // Crear usuarios de prueba
            Usuario admin = new Usuario();
            admin.setNombre("Luis Fernando Rodríguez Fernández");
            admin.setCorreo("luis.rodriguez@banco.com");
            admin.setRol(RolUsuario.ADMINISTRADOR);
            usuarioRepositorio.save(admin);

            Usuario aprobador1 = new Usuario();
            aprobador1.setNombre("María Elena García López");
            aprobador1.setCorreo("maria.garcia@banco.com");
            aprobador1.setRol(RolUsuario.APROBADOR);
            usuarioRepositorio.save(aprobador1);

            Usuario aprobador2 = new Usuario();
            aprobador2.setNombre("Carlos Alberto López Rodríguez");
            aprobador2.setCorreo("carlos.lopez@banco.com");
            aprobador2.setRol(RolUsuario.APROBADOR);
            usuarioRepositorio.save(aprobador2);

            Usuario aprobador3 = new Usuario();
            aprobador3.setNombre("Diana Patricia Morales Cruz");
            aprobador3.setCorreo("diana.morales@banco.com");
            aprobador3.setRol(RolUsuario.APROBADOR);
            usuarioRepositorio.save(aprobador3);

            Usuario solicitante1 = new Usuario();
            solicitante1.setNombre("Juan Carlos Pérez Martínez");
            solicitante1.setCorreo("juan.perez@banco.com");
            solicitante1.setRol(RolUsuario.SOLICITANTE);
            usuarioRepositorio.save(solicitante1);

            Usuario solicitante2 = new Usuario();
            solicitante2.setNombre("Ana Sofía Martínez Sánchez");
            solicitante2.setCorreo("ana.martinez@banco.com");
            solicitante2.setRol(RolUsuario.SOLICITANTE);
            usuarioRepositorio.save(solicitante2);

            Usuario solicitante3 = new Usuario();
            solicitante3.setNombre("Roberto Carlos Jiménez Vargas");
            solicitante3.setCorreo("roberto.jimenez@banco.com");
            solicitante3.setRol(RolUsuario.SOLICITANTE);
            usuarioRepositorio.save(solicitante3);

            System.out.println("✅ Datos de prueba inicializados: " + usuarioRepositorio.count() + " usuarios creados");
        } else {
            System.out.println("ℹ️ Base de datos ya contiene " + usuarioRepositorio.count() + " usuarios - omitiendo inicialización");
        }
    }
}
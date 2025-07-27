package com.kata.KataFlujo.controlador;

import com.kata.KataFlujo.modelo.Usuario;
import com.kata.KataFlujo.modelo.TipoSolicitud;
import com.kata.KataFlujo.servicio.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioControlador {
    
    @Autowired
    private UsuarioServicio usuarioServicio;
    
    // ===============================================
    // OBTENER TODOS LOS USUARIOS
    // ===============================================
    @GetMapping
    public ResponseEntity<SolicitudControlador.RespuestaApi<List<Usuario>>> obtenerTodosLosUsuarios() {
        try {
            List<Usuario> usuarios = usuarioServicio.obtenerTodosLosUsuarios();
            return ResponseEntity.ok(new SolicitudControlador.RespuestaApi<>(true, "Usuarios obtenidos exitosamente", usuarios));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new SolicitudControlador.RespuestaApi<>(false, "Error al obtener usuarios: " + e.getMessage(), null));
        }
    }
    
    // ===============================================
    // OBTENER USUARIO POR ID
    // ===============================================
    @GetMapping("/{id}")
    public ResponseEntity<SolicitudControlador.RespuestaApi<Usuario>> obtenerUsuarioPorId(@PathVariable Long id) {
        try {
            return usuarioServicio.obtenerUsuarioPorId(id)
                .map(usuario -> ResponseEntity.ok(new SolicitudControlador.RespuestaApi<>(true, "Usuario encontrado", usuario)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new SolicitudControlador.RespuestaApi<>(false, "Usuario no encontrado con ID: " + id, null)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new SolicitudControlador.RespuestaApi<>(false, "Error al obtener usuario: " + e.getMessage(), null));
        }
    }
    
    // ===============================================
    // OBTENER APROBADORES (PARA FORMULARIOS)
    // ===============================================
    @GetMapping("/aprobadores")
    public ResponseEntity<SolicitudControlador.RespuestaApi<List<Usuario>>> obtenerAprobadores() {
        try {
            List<Usuario> aprobadores = usuarioServicio.obtenerAprobadores();
            return ResponseEntity.ok(new SolicitudControlador.RespuestaApi<>(true, "Aprobadores obtenidos", aprobadores));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new SolicitudControlador.RespuestaApi<>(false, "Error al obtener aprobadores: " + e.getMessage(), null));
        }
    }
    
    // ===============================================
    // OBTENER SOLICITANTES (PARA FORMULARIOS)
    // ===============================================
    @GetMapping("/solicitantes")
    public ResponseEntity<SolicitudControlador.RespuestaApi<List<Usuario>>> obtenerSolicitantes() {
        try {
            List<Usuario> solicitantes = usuarioServicio.obtenerSolicitantes();
            return ResponseEntity.ok(new SolicitudControlador.RespuestaApi<>(true, "Solicitantes obtenidos", solicitantes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new SolicitudControlador.RespuestaApi<>(false, "Error al obtener solicitantes: " + e.getMessage(), null));
        }
    }
    
    // ===============================================
    // OBTENER TIPOS DE SOLICITUD (CATÁLOGO)
    // ===============================================
    @GetMapping("/tipos-solicitud")
    public ResponseEntity<SolicitudControlador.RespuestaApi<List<TipoSolicitud>>> obtenerTiposSolicitud() {
        try {
            List<TipoSolicitud> tipos = Arrays.asList(TipoSolicitud.obtenerTodos());
            return ResponseEntity.ok(new SolicitudControlador.RespuestaApi<>(true, "Tipos de solicitud obtenidos", tipos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new SolicitudControlador.RespuestaApi<>(false, "Error al obtener tipos de solicitud: " + e.getMessage(), null));
        }
    }
    
    // ===============================================
    // BUSCAR USUARIOS POR NOMBRE
    // ===============================================
    @GetMapping("/buscar")
    public ResponseEntity<SolicitudControlador.RespuestaApi<List<Usuario>>> buscarUsuarios(@RequestParam String nombre) {
        try {
            List<Usuario> usuariosEncontrados = usuarioServicio.buscarUsuariosPorNombre(nombre);
            return ResponseEntity.ok(new SolicitudControlador.RespuestaApi<>(true, "Búsqueda completada", usuariosEncontrados));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new SolicitudControlador.RespuestaApi<>(false, "Error en la búsqueda: " + e.getMessage(), null));
        }
    }
    
    // ===============================================
    // CREAR NUEVO USUARIO
    // ===============================================
    @PostMapping
    public ResponseEntity<SolicitudControlador.RespuestaApi<Usuario>> crearUsuario(@Valid @RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioServicio.crearUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new SolicitudControlador.RespuestaApi<>(true, "Usuario creado exitosamente", nuevoUsuario));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new SolicitudControlador.RespuestaApi<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new SolicitudControlador.RespuestaApi<>(false, "Error interno al crear usuario: " + e.getMessage(), null));
        }
    }
    
    // ===============================================
    // OBTENER ESTADÍSTICAS DE USUARIOS
    // ===============================================
    @GetMapping("/estadisticas")
    public ResponseEntity<SolicitudControlador.RespuestaApi<UsuarioServicio.EstadisticasUsuario>> obtenerEstadisticas() {
        try {
            UsuarioServicio.EstadisticasUsuario estadisticas = usuarioServicio.obtenerEstadisticas();
            return ResponseEntity.ok(new SolicitudControlador.RespuestaApi<>(true, "Estadísticas obtenidas", estadisticas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new SolicitudControlador.RespuestaApi<>(false, "Error al obtener estadísticas: " + e.getMessage(), null));
        }
    }
}

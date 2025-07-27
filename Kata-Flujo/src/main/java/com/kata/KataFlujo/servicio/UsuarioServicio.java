package com.kata.KataFlujo.servicio;

import com.kata.KataFlujo.modelo.Usuario;
import com.kata.KataFlujo.modelo.RolUsuario;
import com.kata.KataFlujo.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServicio {
    
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;
    
    // Obtener todos los usuarios
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepositorio.findAllByOrderByNombreAsc();
    }
    
    // Obtener usuario por ID
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepositorio.findById(id);
    }
    
    // Obtener usuario por correo
    public Optional<Usuario> obtenerUsuarioPorCorreo(String correo) {
        return usuarioRepositorio.findByCorreo(correo);
    }
    
    // Obtener solo los aprobadores (para seleccionar en formularios)
    public List<Usuario> obtenerAprobadores() {
        return usuarioRepositorio.obtenerAprobadores();
    }
    
    // Obtener solo los solicitantes
    public List<Usuario> obtenerSolicitantes() {
        return usuarioRepositorio.obtenerSolicitantes();
    }
    
    // Buscar usuarios por nombre
    public List<Usuario> buscarUsuariosPorNombre(String nombre) {
        return usuarioRepositorio.findByNombreContainingIgnoreCase(nombre);
    }
    
    // Crear nuevo usuario
    public Usuario crearUsuario(Usuario usuario) {
        // Validar que no exista el correo
        if (usuarioRepositorio.existsByCorreo(usuario.getCorreo())) {
            throw new RuntimeException("Ya existe un usuario con el correo: " + usuario.getCorreo());
        }
        return usuarioRepositorio.save(usuario);
    }
    
    // Actualizar usuario
    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        return usuarioRepositorio.findById(id)
            .map(usuario -> {
                usuario.setNombre(usuarioActualizado.getNombre());
                usuario.setCorreo(usuarioActualizado.getCorreo());
                usuario.setRol(usuarioActualizado.getRol());
                return usuarioRepositorio.save(usuario);
            })
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }
    
    // Eliminar usuario
    public void eliminarUsuario(Long id) {
        if (!usuarioRepositorio.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepositorio.deleteById(id);
    }
    
    // Obtener estadísticas de usuarios
    public EstadisticasUsuario obtenerEstadisticas() {
        long totalUsuarios = usuarioRepositorio.count();
        long totalSolicitantes = usuarioRepositorio.countByRol(RolUsuario.SOLICITANTE);
        long totalAprobadores = usuarioRepositorio.countByRol(RolUsuario.APROBADOR);
        long totalAdministradores = usuarioRepositorio.countByRol(RolUsuario.ADMINISTRADOR);
        
        return new EstadisticasUsuario(totalUsuarios, totalSolicitantes, totalAprobadores, totalAdministradores);
    }
    
    // Clase interna para estadísticas
    public static class EstadisticasUsuario {
        private long totalUsuarios;
        private long totalSolicitantes;
        private long totalAprobadores;
        private long totalAdministradores;
        
        public EstadisticasUsuario(long totalUsuarios, long totalSolicitantes, long totalAprobadores, long totalAdministradores) {
            this.totalUsuarios = totalUsuarios;
            this.totalSolicitantes = totalSolicitantes;
            this.totalAprobadores = totalAprobadores;
            this.totalAdministradores = totalAdministradores;
        }
        
        // Getters
        public long getTotalUsuarios() { return totalUsuarios; }
        public long getTotalSolicitantes() { return totalSolicitantes; }
        public long getTotalAprobadores() { return totalAprobadores; }
        public long getTotalAdministradores() { return totalAdministradores; }
    }
}
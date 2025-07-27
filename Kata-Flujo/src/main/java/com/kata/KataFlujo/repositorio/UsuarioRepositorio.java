package com.kata.KataFlujo.repositorio;

import com.kata.KataFlujo.modelo.Usuario;
import com.kata.KataFlujo.modelo.RolUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    
    // Buscar usuario por correo electrónico
    Optional<Usuario> findByCorreo(String correo);
    
    // Buscar usuarios por rol
    List<Usuario> findByRol(RolUsuario rol);
    
    // Buscar usuarios por nombre (contiene texto)
    List<Usuario> findByNombreContainingIgnoreCase(String nombre);
    
    // Obtener solo aprobadores (para formularios)
    @Query("SELECT u FROM Usuario u WHERE u.rol = 'APROBADOR' OR u.rol = 'ADMINISTRADOR' ORDER BY u.nombre")
    List<Usuario> obtenerAprobadores();
    
    // Obtener solo solicitantes
    @Query("SELECT u FROM Usuario u WHERE u.rol = 'SOLICITANTE' ORDER BY u.nombre")
    List<Usuario> obtenerSolicitantes();
    
    // Verificar si existe usuario con ese correo
    boolean existsByCorreo(String correo);
    
    // Contar usuarios por rol
    long countByRol(RolUsuario rol);
    
    // Buscar usuarios ordenados por nombre
    List<Usuario> findAllByOrderByNombreAsc();
}

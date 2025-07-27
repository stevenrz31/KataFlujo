package com.kata.KataFlujo.repositorio;

import com.kata.KataFlujo.modelo.HistorialSolicitud;
import com.kata.KataFlujo.modelo.EstadoSolicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface HistorialSolicitudRepositorio extends JpaRepository<HistorialSolicitud, Long> {
    
    // Obtener historial de una solicitud específica
    List<HistorialSolicitud> findBySolicitudIdOrderByFechaCreacionAsc(String solicitudId);
    
    // Obtener historial con información del usuario que realizó la acción
    @Query("SELECT h, u.nombre FROM HistorialSolicitud h " +
           "JOIN Usuario u ON h.accionPor = u.id " +
           "WHERE h.solicitudId = :solicitudId " +
           "ORDER BY h.fechaCreacion ASC")
    List<Object[]> obtenerHistorialConNombresUsuarios(@Param("solicitudId") String solicitudId);
    
    // Contar acciones realizadas por un usuario
    long countByAccionPor(Long usuarioId);
    
    // Obtener últimas acciones del sistema (actividad reciente)
    @Query("SELECT h FROM HistorialSolicitud h ORDER BY h.fechaCreacion DESC")
    List<HistorialSolicitud> obtenerActividadReciente();
    
    // Historial por tipo de estado nuevo
    List<HistorialSolicitud> findByEstadoNuevo(EstadoSolicitud estadoNuevo);
    
    // Historial de un usuario específico (todas sus acciones)
    @Query("SELECT h FROM HistorialSolicitud h " +
           "WHERE h.accionPor = :usuarioId " +
           "ORDER BY h.fechaCreacion DESC")
    List<HistorialSolicitud> obtenerHistorialPorUsuario(@Param("usuarioId") Long usuarioId);
    
    // Estadísticas: acciones por día
    @Query("SELECT DATE(h.fechaCreacion), COUNT(h) FROM HistorialSolicitud h " +
           "WHERE h.fechaCreacion >= :fechaDesde " +
           "GROUP BY DATE(h.fechaCreacion) " +
           "ORDER BY DATE(h.fechaCreacion)")
    List<Object[]> obtenerEstadisticasPorDia(@Param("fechaDesde") LocalDateTime fechaDesde);
    
    // Obtener cambios de estado recientes
    @Query("SELECT h FROM HistorialSolicitud h " +
           "WHERE h.estadoAnterior IS NOT NULL " +
           "AND h.fechaCreacion >= :fechaDesde " +
           "ORDER BY h.fechaCreacion DESC")
    List<HistorialSolicitud> obtenerCambiosEstadoRecientes(@Param("fechaDesde") LocalDateTime fechaDesde);
}

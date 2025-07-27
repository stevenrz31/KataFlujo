package com.kata.KataFlujo.repositorio;

import com.kata.KataFlujo.modelo.Solicitud;
import com.kata.KataFlujo.modelo.EstadoSolicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface SolicitudRepositorio extends JpaRepository<Solicitud, String> {
    
    // Buscar solicitudes por estado
    List<Solicitud> findByEstado(EstadoSolicitud estado);
    
    // Buscar solicitudes por solicitante
    List<Solicitud> findBySolicitanteId(Long solicitanteId);
    
    // Buscar solicitudes pendientes por aprobador
    List<Solicitud> findByAprobadorIdAndEstado(Long aprobadorId, EstadoSolicitud estado);
    
    // Buscar todas las solicitudes de un aprobador
    List<Solicitud> findByAprobadorId(Long aprobadorId);
    
    // Buscar por tipo de solicitud
    List<Solicitud> findByTipoSolicitud(String tipoSolicitud);
    
    // Buscar solicitudes por título (contiene texto)
    List<Solicitud> findByTituloContainingIgnoreCase(String titulo);
    
    // Query para obtener solicitudes con información completa de usuarios
    @Query("SELECT s FROM Solicitud s " +
           "LEFT JOIN FETCH s.solicitante " +
           "LEFT JOIN FETCH s.aprobador " +
           "ORDER BY s.fechaCreacion DESC")
    List<Solicitud> obtenerTodasConUsuarios();
    
    // Solicitudes pendientes de un aprobador con información completa
    @Query("SELECT s FROM Solicitud s " +
           "LEFT JOIN FETCH s.solicitante " +
           "LEFT JOIN FETCH s.aprobador " +
           "WHERE s.aprobadorId = :aprobadorId AND s.estado = :estado " +
           "ORDER BY s.fechaCreacion ASC")
    List<Solicitud> obtenerSolicitudesPendientesParaAprobador(
        @Param("aprobadorId") Long aprobadorId, 
        @Param("estado") EstadoSolicitud estado
    );
    
    // Contar solicitudes por estado
    long countByEstado(EstadoSolicitud estado);
    
    // Buscar solicitudes por múltiples estados
    List<Solicitud> findByEstadoIn(List<EstadoSolicitud> estados);
    
    // Buscar solicitudes recientes (últimos 30 días)
    @Query("SELECT s FROM Solicitud s WHERE s.fechaCreacion >= :fechaDesde ORDER BY s.fechaCreacion DESC")
    List<Solicitud> obtenerSolicitudesRecientes(@Param("fechaDesde") LocalDateTime fechaDesde);
    
    // Buscar solicitudes por rango de fechas
    List<Solicitud> findByFechaCreacionBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    
    // Dashboard: contar solicitudes por aprobador
    @Query("SELECT s.aprobadorId, COUNT(s) FROM Solicitud s WHERE s.estado = 'PENDIENTE' GROUP BY s.aprobadorId")
    List<Object[]> contarSolicitudesPendientesPorAprobador();
    
    // Buscar mis solicitudes (como solicitante)
    @Query("SELECT s FROM Solicitud s " +
           "LEFT JOIN FETCH s.aprobador " +
           "WHERE s.solicitanteId = :solicitanteId " +
           "ORDER BY s.fechaCreacion DESC")
    List<Solicitud> obtenerMisSolicitudes(@Param("solicitanteId") Long solicitanteId);
    
    // Top 5 solicitudes más recientes
    @Query("SELECT s FROM Solicitud s " +
           "LEFT JOIN FETCH s.solicitante " +
           "LEFT JOIN FETCH s.aprobador " +
           "ORDER BY s.fechaCreacion DESC")
    List<Solicitud> obtenerTop5Recientes();
}

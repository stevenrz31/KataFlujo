package com.kata.KataFlujo.servicio;

import com.kata.KataFlujo.modelo.Solicitud;
import com.kata.KataFlujo.modelo.EstadoSolicitud;
import com.kata.KataFlujo.modelo.HistorialSolicitud;
import com.kata.KataFlujo.repositorio.SolicitudRepositorio;
import com.kata.KataFlujo.repositorio.HistorialSolicitudRepositorio;
import com.kata.KataFlujo.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SolicitudServicio {
    
    @Autowired
    private SolicitudRepositorio solicitudRepositorio;
    
    @Autowired
    private HistorialSolicitudRepositorio historialRepositorio;
    
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;
    
    // Obtener todas las solicitudes con información de usuarios
    public List<Solicitud> obtenerTodasLasSolicitudes() {
        return solicitudRepositorio.obtenerTodasConUsuarios();
    }
    
    // Obtener solicitud por ID
    public Optional<Solicitud> obtenerSolicitudPorId(String id) {
        return solicitudRepositorio.findById(id);
    }
    
    // Crear nueva solicitud
    @Transactional
    public Solicitud crearSolicitud(Solicitud solicitud) {
        // Validar que existan el solicitante y aprobador
        if (!usuarioRepositorio.existsById(solicitud.getSolicitanteId())) {
            throw new RuntimeException("Solicitante no encontrado con ID: " + solicitud.getSolicitanteId());
        }
        if (!usuarioRepositorio.existsById(solicitud.getAprobadorId())) {
            throw new RuntimeException("Aprobador no encontrado con ID: " + solicitud.getAprobadorId());
        }
        
        // Guardar la solicitud
        Solicitud solicitudGuardada = solicitudRepositorio.save(solicitud);
        
        // Crear entrada en el historial
        HistorialSolicitud historial = new HistorialSolicitud(
            solicitudGuardada.getId(),
            null,
            EstadoSolicitud.PENDIENTE,
            solicitud.getSolicitanteId(),
            "Solicitud creada automáticamente por el sistema"
        );
        historialRepositorio.save(historial);
        
        return solicitudGuardada;
    }
    
    // Aprobar solicitud
    @Transactional
    public Solicitud aprobarSolicitud(String solicitudId, Long aprobadorId, String comentarios) {
        return cambiarEstadoSolicitud(solicitudId, EstadoSolicitud.APROBADA, aprobadorId, comentarios);
    }
    
    // Rechazar solicitud
    @Transactional
    public Solicitud rechazarSolicitud(String solicitudId, Long aprobadorId, String comentarios) {
        return cambiarEstadoSolicitud(solicitudId, EstadoSolicitud.RECHAZADA, aprobadorId, comentarios);
    }
    
    // Método privado para cambiar estado
    private Solicitud cambiarEstadoSolicitud(String solicitudId, EstadoSolicitud nuevoEstado, Long usuarioId, String comentarios) {
        Solicitud solicitud = solicitudRepositorio.findById(solicitudId)
            .orElseThrow(() -> new RuntimeException("Solicitud no encontrada con ID: " + solicitudId));
        
        EstadoSolicitud estadoAnterior = solicitud.getEstado();
        
        // Actualizar la solicitud
        solicitud.setEstado(nuevoEstado);
        solicitud.setComentarios(comentarios);
        solicitud.setFechaActualizacion(LocalDateTime.now());
        
        Solicitud solicitudActualizada = solicitudRepositorio.save(solicitud);
        
        // Registrar en el historial
        HistorialSolicitud historial = new HistorialSolicitud(
            solicitudId,
            estadoAnterior,
            nuevoEstado,
            usuarioId,
            comentarios != null ? comentarios : "Sin comentarios"
        );
        historialRepositorio.save(historial);
        
        return solicitudActualizada;
    }
    
    // Obtener solicitudes pendientes para un aprobador
    public List<Solicitud> obtenerSolicitudesPendientesPorAprobador(Long aprobadorId) {
        return solicitudRepositorio.obtenerSolicitudesPendientesParaAprobador(aprobadorId, EstadoSolicitud.PENDIENTE);
    }
    
    // Obtener mis solicitudes (como solicitante)
    public List<Solicitud> obtenerMisSolicitudes(Long solicitanteId) {
        return solicitudRepositorio.obtenerMisSolicitudes(solicitanteId);
    }
    
    // Buscar solicitudes por título
    public List<Solicitud> buscarSolicitudesPorTitulo(String titulo) {
        return solicitudRepositorio.findByTituloContainingIgnoreCase(titulo);
    }
    
    // Obtener solicitudes por estado
    public List<Solicitud> obtenerSolicitudesPorEstado(EstadoSolicitud estado) {
        return solicitudRepositorio.findByEstado(estado);
    }
    
    // Obtener solicitudes recientes (últimos 30 días)
    public List<Solicitud> obtenerSolicitudesRecientes() {
        LocalDateTime fechaDesde = LocalDateTime.now().minusDays(30);
        return solicitudRepositorio.obtenerSolicitudesRecientes(fechaDesde);
    }
    
    // Obtener estadísticas de solicitudes
    public EstadisticasSolicitud obtenerEstadisticas() {
        long totalSolicitudes = solicitudRepositorio.count();
        long pendientes = solicitudRepositorio.countByEstado(EstadoSolicitud.PENDIENTE);
        long aprobadas = solicitudRepositorio.countByEstado(EstadoSolicitud.APROBADA);
        long rechazadas = solicitudRepositorio.countByEstado(EstadoSolicitud.RECHAZADA);
        
        return new EstadisticasSolicitud(totalSolicitudes, pendientes, aprobadas, rechazadas);
    }
    
    // Clase interna para estadísticas
    public static class EstadisticasSolicitud {
        private long totalSolicitudes;
        private long pendientes;
        private long aprobadas;
        private long rechazadas;
        
        public EstadisticasSolicitud(long totalSolicitudes, long pendientes, long aprobadas, long rechazadas) {
            this.totalSolicitudes = totalSolicitudes;
            this.pendientes = pendientes;
            this.aprobadas = aprobadas;
            this.rechazadas = rechazadas;
        }
        
        // Getters
        public long getTotalSolicitudes() { return totalSolicitudes; }
        public long getPendientes() { return pendientes; }
        public long getAprobadas() { return aprobadas; }
        public long getRechazadas() { return rechazadas; }
    }
}

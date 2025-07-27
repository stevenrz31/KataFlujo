package com.kata.KataFlujo.servicio;

import com.kata.KataFlujo.modelo.HistorialSolicitud;
import com.kata.KataFlujo.repositorio.HistorialSolicitudRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class HistorialServicio {
    
    @Autowired
    private HistorialSolicitudRepositorio historialRepositorio;
    
    // Obtener historial de una solicitud específica
    public List<HistorialSolicitud> obtenerHistorialPorSolicitud(String solicitudId) {
        return historialRepositorio.findBySolicitudIdOrderByFechaCreacionAsc(solicitudId);
    }
    
    // Obtener historial con nombres de usuarios
    public List<Object[]> obtenerHistorialConNombres(String solicitudId) {
        return historialRepositorio.obtenerHistorialConNombresUsuarios(solicitudId);
    }
    
    // Obtener actividad reciente del sistema
    public List<HistorialSolicitud> obtenerActividadReciente() {
        return historialRepositorio.obtenerActividadReciente();
    }
    
    // Obtener historial de acciones de un usuario
    public List<HistorialSolicitud> obtenerHistorialPorUsuario(Long usuarioId) {
        return historialRepositorio.obtenerHistorialPorUsuario(usuarioId);
    }
    
    // Obtener estadísticas de actividad por día
    public List<Object[]> obtenerEstadisticasActividad() {
        LocalDateTime fechaDesde = LocalDateTime.now().minusDays(30);
        return historialRepositorio.obtenerEstadisticasPorDia(fechaDesde);
    }
}
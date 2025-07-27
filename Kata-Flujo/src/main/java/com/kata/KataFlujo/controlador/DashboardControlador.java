package com.kata.KataFlujo.controlador;

import com.kata.KataFlujo.modelo.EstadoSolicitud;
import com.kata.KataFlujo.modelo.HistorialSolicitud;
import com.kata.KataFlujo.servicio.SolicitudServicio;
import com.kata.KataFlujo.servicio.UsuarioServicio;
import com.kata.KataFlujo.servicio.HistorialServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardControlador {
    
    @Autowired
    private SolicitudServicio solicitudServicio;
    
    @Autowired
    private UsuarioServicio usuarioServicio;
    
    @Autowired
    private HistorialServicio historialServicio;
    
    // ===============================================
    // RESUMEN GENERAL DEL DASHBOARD
    // ===============================================
    @GetMapping("/resumen")
    public ResponseEntity<SolicitudControlador.RespuestaApi<Map<String, Object>>> obtenerResumenDashboard() {
        try {
            Map<String, Object> resumen = new HashMap<>();
            
            // Estadísticas de solicitudes
            SolicitudServicio.EstadisticasSolicitud estadisticasSolicitudes = solicitudServicio.obtenerEstadisticas();
            resumen.put("solicitudes", estadisticasSolicitudes);
            
            // Estadísticas de usuarios
            UsuarioServicio.EstadisticasUsuario estadisticasUsuarios = usuarioServicio.obtenerEstadisticas();
            resumen.put("usuarios", estadisticasUsuarios);
            
            // Actividad reciente
            List<HistorialSolicitud> actividadReciente = historialServicio.obtenerActividadReciente();
            resumen.put("actividadReciente", actividadReciente.subList(0, Math.min(5, actividadReciente.size())));
            
            return ResponseEntity.ok(new SolicitudControlador.RespuestaApi<>(true, "Resumen del dashboard obtenido", resumen));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new SolicitudControlador.RespuestaApi<>(false, "Error al obtener resumen: " + e.getMessage(), null));
        }
    }
    
    // ===============================================
    // HEALTH CHECK DE LA API
    // ===============================================
    @GetMapping("/health")
    public ResponseEntity<SolicitudControlador.RespuestaApi<Map<String, String>>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "OK");
        status.put("mensaje", "API Kata Flujo funcionando correctamente");
        status.put("version", "1.0.0");
        
        return ResponseEntity.ok(new SolicitudControlador.RespuestaApi<>(true, "Sistema funcionando", status));
    }
}
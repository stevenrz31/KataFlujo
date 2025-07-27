package com.kata.KataFlujo.controlador;

import com.kata.KataFlujo.modelo.Solicitud;
import com.kata.KataFlujo.modelo.EstadoSolicitud;
import com.kata.KataFlujo.modelo.HistorialSolicitud;
import com.kata.KataFlujo.servicio.SolicitudServicio;
import com.kata.KataFlujo.servicio.HistorialServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "http://localhost:3000")
public class SolicitudControlador {
    
    @Autowired
    private SolicitudServicio solicitudServicio;
    
    @Autowired
    private HistorialServicio historialServicio;
    
    // ===============================================
    // OBTENER TODAS LAS SOLICITUDES
    // ===============================================
    @GetMapping
    public ResponseEntity<RespuestaApi<List<Solicitud>>> obtenerTodasLasSolicitudes() {
        try {
            List<Solicitud> solicitudes = solicitudServicio.obtenerTodasLasSolicitudes();
            return ResponseEntity.ok(new RespuestaApi<>(true, "Solicitudes obtenidas exitosamente", solicitudes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RespuestaApi<>(false, "Error al obtener solicitudes: " + e.getMessage(), null));
        }
    }
    
    // ===============================================
    // OBTENER SOLICITUD POR ID
    // ===============================================
    @GetMapping("/{id}")
    public ResponseEntity<RespuestaApi<SolicitudDetallada>> obtenerSolicitudPorId(@PathVariable String id) {
        try {
            return solicitudServicio.obtenerSolicitudPorId(id)
                .map(solicitud -> {
                    // Obtener historial de la solicitud
                    List<HistorialSolicitud> historial = historialServicio.obtenerHistorialPorSolicitud(id);
                    SolicitudDetallada solicitudDetallada = new SolicitudDetallada(solicitud, historial);
                    
                    return ResponseEntity.ok(new RespuestaApi<>(true, "Solicitud encontrada", solicitudDetallada));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new RespuestaApi<>(false, "Solicitud no encontrada con ID: " + id, null)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RespuestaApi<>(false, "Error al obtener solicitud: " + e.getMessage(), null));
        }
    }
    
    // ===============================================
    // CREAR NUEVA SOLICITUD
    // ===============================================
    @PostMapping
    public ResponseEntity<RespuestaApi<Solicitud>> crearSolicitud(@Valid @RequestBody Solicitud solicitud) {
        try {
            Solicitud nuevaSolicitud = solicitudServicio.crearSolicitud(solicitud);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RespuestaApi<>(true, "Solicitud creada exitosamente", nuevaSolicitud));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new RespuestaApi<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RespuestaApi<>(false, "Error interno al crear solicitud: " + e.getMessage(), null));
        }
    }
    
    // ===============================================
    // APROBAR SOLICITUD
    // ===============================================
    @PutMapping("/{id}/aprobar")
    public ResponseEntity<RespuestaApi<Solicitud>> aprobarSolicitud(
            @PathVariable String id,
            @RequestBody Map<String, Object> datos) {
        try {
            Long aprobadorId = Long.valueOf(datos.get("aprobadorId").toString());
            String comentarios = datos.get("comentarios") != null ? datos.get("comentarios").toString() : "";
            
            Solicitud solicitudAprobada = solicitudServicio.aprobarSolicitud(id, aprobadorId, comentarios);
            return ResponseEntity.ok(new RespuestaApi<>(true, "Solicitud aprobada exitosamente", solicitudAprobada));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new RespuestaApi<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RespuestaApi<>(false, "Error al aprobar solicitud: " + e.getMessage(), null));
        }
    }
    
    // ===============================================
    // RECHAZAR SOLICITUD
    // ===============================================
    @PutMapping("/{id}/rechazar")
    public ResponseEntity<RespuestaApi<Solicitud>> rechazarSolicitud(
            @PathVariable String id,
            @RequestBody Map<String, Object> datos) {
        try {
            Long aprobadorId = Long.valueOf(datos.get("aprobadorId").toString());
            String comentarios = datos.get("comentarios") != null ? datos.get("comentarios").toString() : "";
            
            Solicitud solicitudRechazada = solicitudServicio.rechazarSolicitud(id, aprobadorId, comentarios);
            return ResponseEntity.ok(new RespuestaApi<>(true, "Solicitud rechazada", solicitudRechazada));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new RespuestaApi<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RespuestaApi<>(false, "Error al rechazar solicitud: " + e.getMessage(), null));
        }
    }
    

    // OBTENER SOLICITUDES PENDIENTES POR APROBADOR

    @GetMapping("/aprobador/{aprobadorId}/pendientes")
    public ResponseEntity<RespuestaApi<List<Solicitud>>> obtenerSolicitudesPendientesPorAprobador(@PathVariable Long aprobadorId) {
        try {
            List<Solicitud> solicitudesPendientes = solicitudServicio.obtenerSolicitudesPendientesPorAprobador(aprobadorId);
            return ResponseEntity.ok(new RespuestaApi<>(true, "Solicitudes pendientes obtenidas", solicitudesPendientes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RespuestaApi<>(false, "Error al obtener solicitudes pendientes: " + e.getMessage(), null));
        }
    }
    

    // OBTENER MIS SOLICITUDES (COMO SOLICITANTE)

    @GetMapping("/solicitante/{solicitanteId}")
    public ResponseEntity<RespuestaApi<List<Solicitud>>> obtenerMisSolicitudes(@PathVariable Long solicitanteId) {
        try {
            List<Solicitud> misSolicitudes = solicitudServicio.obtenerMisSolicitudes(solicitanteId);
            return ResponseEntity.ok(new RespuestaApi<>(true, "Mis solicitudes obtenidas", misSolicitudes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RespuestaApi<>(false, "Error al obtener mis solicitudes: " + e.getMessage(), null));
        }
    }
    
    // BUSCAR SOLICITUDES POR TÍTULO

    @GetMapping("/buscar")
    public ResponseEntity<RespuestaApi<List<Solicitud>>> buscarSolicitudes(@RequestParam String titulo) {
        try {
            List<Solicitud> solicitudesEncontradas = solicitudServicio.buscarSolicitudesPorTitulo(titulo);
            return ResponseEntity.ok(new RespuestaApi<>(true, "Búsqueda completada", solicitudesEncontradas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RespuestaApi<>(false, "Error en la búsqueda: " + e.getMessage(), null));
        }
    }
    
  
    // OBTENER ESTADÍSTICAS DE SOLICITUDES
    
    @GetMapping("/estadisticas")
    public ResponseEntity<RespuestaApi<SolicitudServicio.EstadisticasSolicitud>> obtenerEstadisticas() {
        try {
            SolicitudServicio.EstadisticasSolicitud estadisticas = solicitudServicio.obtenerEstadisticas();
            return ResponseEntity.ok(new RespuestaApi<>(true, "Estadísticas obtenidas", estadisticas));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RespuestaApi<>(false, "Error al obtener estadísticas: " + e.getMessage(), null));
        }
    }
    
    // CLASES AUXILIARES
    
    // Clase para respuesta API estandarizada
    public static class RespuestaApi<T> {
        private boolean exito;
        private String mensaje;
        private T datos;
        
        public RespuestaApi(boolean exito, String mensaje, T datos) {
            this.exito = exito;
            this.mensaje = mensaje;
            this.datos = datos;
        }
        
        // Getters
        public boolean isExito() { return exito; }
        public String getMensaje() { return mensaje; }
        public T getDatos() { return datos; }
    }
    
    // Clase para solicitud con historial
    public static class SolicitudDetallada {
        private Solicitud solicitud;
        private List<HistorialSolicitud> historial;
        
        public SolicitudDetallada(Solicitud solicitud, List<HistorialSolicitud> historial) {
            this.solicitud = solicitud;
            this.historial = historial;
        }
        
        // Getters
        public Solicitud getSolicitud() { return solicitud; }
        public List<HistorialSolicitud> getHistorial() { return historial; }
    }
}
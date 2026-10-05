// Colores y helpers sacados del diseño de Figma
export const colors = {
  primary: '#3498DB',      // azul de botones, links y checkbox
  text: '#1D1D1F',
  textSecondary: '#8A8A8E',
  border: '#E3E3E6',
  surface: '#F5F5F7',      // cajas grises (dirección, tarjeta)
  background: '#FFFFFF',
  separator: '#F2F2F4',    // franjas grises de 8px entre secciones
  banner: '#FFF7D6',       // aviso amarillo de envío
  danger: '#F26B6B',       // tacho de basura
  success: '#2DB55D',
};

// $147,45 (formato del diseño: coma decimal)
export const formatPrice = (n) => `$${n.toFixed(2).replace('.', ',')}`;

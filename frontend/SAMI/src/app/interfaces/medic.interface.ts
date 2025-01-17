export interface Medic {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
  cedula: string;
  role: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  especialidad: string;
  citasMedicas: Array<{
    id: string;
  }>;
}

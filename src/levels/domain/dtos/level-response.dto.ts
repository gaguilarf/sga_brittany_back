export class CourseResponseDto {
  id: number;
  name: string;
  active: boolean;
}

export class LevelResponseDto {
  id: number;
  courseId: number;
  nombreNivel: string;
  active: boolean;
}

export class CycleResponseDto {
  id: number;
  levelId: number;
  nombreCiclo: string;
  active: boolean;
}

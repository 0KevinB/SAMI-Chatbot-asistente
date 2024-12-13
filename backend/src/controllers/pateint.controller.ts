import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { PatientService } from "@/services/pateint.service";

export class PatientController {
  static async getAllPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const patients = await PatientService.getAllPatients();
      res.json(patients);
    } catch (error: any) {
      res.status(500).json({ mensaje: error.message });
    }
  }

  static async getPatientById(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const { id } = req.params;
      const patient = await PatientService.getPatientById(id);
      res.json(patient);
    } catch (error: any) {
      res.status(error.status || 500).json({ mensaje: error.message });
    }
  }

  static async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const patient = await PatientService.createPatient(req.body);
      res.status(201).json(patient);
    } catch (error: any) {
      res.status(500).json({ mensaje: error.message });
    }
  }

  static async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const { id } = req.params;
      const updatedPatient = await PatientService.updatePatient(id, req.body);
      res.json(updatedPatient);
    } catch (error: any) {
      res.status(500).json({ mensaje: error.message });
    }
  }

  static async deletePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const { id } = req.params;
      await PatientService.deletePatient(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ mensaje: error.message });
    }
  }
}

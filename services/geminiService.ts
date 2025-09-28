
import { GoogleGenAI, Type } from "@google/genai";
import { Employee, AttritionPrediction } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll alert the user and disable the feature.
  alert("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const attritionPredictionSchema = {
    type: Type.OBJECT,
    properties: {
        risk: {
            type: Type.STRING,
            description: "The predicted attrition risk level. Must be one of: Low, Medium, High.",
            enum: ["Low", "Medium", "High"]
        },
        reason: {
            type: Type.STRING,
            description: "A concise, data-driven explanation for the predicted risk level, based on the employee's data."
        },
        recommendations: {
            type: Type.STRING,
            description: "Three actionable, bullet-pointed recommendations for HR or the manager to mitigate this risk."
        }
    },
    required: ["risk", "reason", "recommendations"]
};

export const predictAttrition = async (employee: Employee): Promise<AttritionPrediction | null> => {
    if (!process.env.API_KEY) {
        console.error("Gemini API key not configured.");
        return null;
    }

    const prompt = `
        Analyze the following employee data and predict their attrition risk.
        Provide a concise reason and actionable recommendations.

        - Name: ${employee.name}
        - Role: ${employee.role}
        - Department: ${employee.department}
        - Salary: $${employee.salary.toLocaleString()}
        - Start Date: ${employee.startDate}
        - Performance Rating (1-5): ${employee.performanceRating}
        - Job Satisfaction Score (1-10): ${employee.satisfactionScore}
        - Projects Completed: ${employee.projectsCompleted}
        - Last Performance Review: ${employee.lastReviewDate}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are an expert HR analyst specializing in predictive workforce analytics. Your task is to assess an employee's likelihood of leaving the company (attrition risk) based on the data provided. Respond only with the JSON object as defined by the schema.",
                responseMimeType: "application/json",
                responseSchema: attritionPredictionSchema,
                temperature: 0.2
            },
        });

        const jsonText = response.text.trim();
        const prediction = JSON.parse(jsonText) as AttritionPrediction;
        return prediction;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Fallback or error handling
        return {
            risk: "High",
            reason: "An error occurred while analyzing the data. Could not determine risk.",
            recommendations: "Please check the API configuration and try again."
        } as AttritionPrediction;
    }
};

import React, { useEffect, useState } from 'react';
import { BarChart } from '../../components/chart/bar-chart/BarChart';
import { PieChart } from '../../components/chart/pie-chart/PieChart';
import { fetchAnalyticsData } from '../../services/analyticsService';
import { AnalyticsData } from '../../types/analytics';
import './PeopleAnalytics.css';

const formatCost = (cost: number) => `${(cost / 1_000_000).toFixed(1)}M€`;

export const PeopleAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const analyticsData = await fetchAnalyticsData();
        setData(analyticsData);
      } catch {
        setError('No se pudo cargar la información de analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Cargando datos...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return null;

  return (
    <div className="analytics-dashboard">
      <h1 className="dashboard-title">People Analytics</h1>

      <div className="analytics-row">
        <BarChart 
          data={data.employeeEvolution}
          title="Evolución de la plantilla"
          valueKey="count"
        />
        <BarChart 
          data={data.employeeEvolution}
          title="Evolución del coste de la plantilla"
          valueKey="cost"
          formatValue={formatCost}
        />
      </div>

      <div className="analytics-row">
        <PieChart 
          data={data.departmentDistribution}
          title="Distribución por departamento"
        />
        <PieChart 
          data={data.departmentCostDistribution}
          title="Distribución del coste por departamento"
        />
      </div>

      <div className="analytics-row single">
        <PieChart 
          data={data.techRolesDistribution}
          title="Distribución en el departamento de Tecnología"
        />
      </div>
    </div>
  );
};

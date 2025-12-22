import React from 'react';
import { Database, Plus, ToggleLeft, ToggleRight, Edit, Clock, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useDatasets, useUpdateDataset } from '../../hooks/api/useAdminApi';
import { useToast } from '../../components/ui/Toast';
import { getApiError } from '../../lib/api/client';
import { Skeleton } from '../../components/ui/Skeleton';
import { cn } from '../../lib/utils';

export const DatasetManagement = () => {
  const { data: datasetsData, isLoading, error } = useDatasets();
  const updateDatasetMutation = useUpdateDataset();
  const { showToast } = useToast();

  const datasets = datasetsData?.datasets || [];

  const toggleDatasetStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDatasetMutation.mutateAsync({
        id,
        data: { isActive: !currentStatus }
      });
      showToast({
        title: currentStatus ? 'Dataset deactivated' : 'Dataset activated',
        variant: 'success',
      });
    } catch (err) {
      const apiError = getApiError(err);
      showToast({
        title: 'Failed to update dataset',
        description: apiError.message,
        variant: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Datasets</h1>
           <p className="text-slate-500 text-sm mt-1">Manage question collections and packs.</p>
        </div>
        <Button className="bg-brand-purple hover:bg-brand-darkPurple text-white shadow-lg shadow-brand-purple/20">
          <Plus className="mr-2 h-4 w-4" />
          Create Dataset
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-white">
              <CardHeader>
                <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-slate-700 font-medium">Failed to load datasets</h3>
          <p className="text-slate-400 text-sm mt-1">Please try again later.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {datasets.map((dataset: any) => (
            <Card
              key={dataset.id}
              className={cn(
                 "bg-white border-t-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group",
                 dataset.isActive ? "border-brand-sky border-x-slate-200 border-b-slate-200" : "border-slate-300 opacity-75 hover:opacity-100"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className={cn(
                      "p-2.5 rounded-xl border border-slate-200 transition-colors",
                      dataset.isActive ? "bg-brand-sky/10 text-brand-sky" : "bg-slate-100 text-slate-400"
                  )}>
                    <Database className="h-6 w-6" />
                  </div>
                  <button
                      onClick={() => toggleDatasetStatus(dataset.id, dataset.isActive)}
                      className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      title={dataset.isActive ? "Deactivate" : "Activate"}
                      disabled={updateDatasetMutation.isPending}
                  >
                    {updateDatasetMutation.isPending ? (
                      <Loader2 className="h-9 w-9 animate-spin text-slate-300" />
                    ) : dataset.isActive ? (
                      <ToggleRight className="h-9 w-9 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-9 w-9 text-slate-300" />
                    )}
                  </button>
                </div>
                <CardTitle className="text-xl text-slate-900 group-hover:text-brand-sky transition-colors">{dataset.name}</CardTitle>
                <CardDescription className="text-slate-500 h-10 line-clamp-2">{dataset.description}</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-100">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center text-slate-500 gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Questions</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">{dataset.questionCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center text-slate-500 gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Updated</span>
                      </div>
                      <span className="font-mono text-slate-600">{new Date(dataset.updatedAt || dataset.lastUpdated).toLocaleDateString()}</span>
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Content
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
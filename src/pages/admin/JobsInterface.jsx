import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PublishIcon from "@mui/icons-material/Publish";
import api from "../../services/api";
import { TextField, Button, Slider, Box } from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNotification } from "../../context/useNotificationContext";

const schema = yup.object({
  jobPosition: yup.string().required("Job position is required"),
  company: yup.string().required("Company name is required"),
  experience: yup
    .array()
    .of(
      yup
        .number()
        .min(0, "Minimum experience cannot be negative")
        .max(30, "Maximum experience cannot exceed 30 years")
    )
    .length(2, "Experience range is required")
    .required("Experience range is required"),
  location: yup.string().required("Location is required"),
  deadline: yup.date().required("Last date to apply is required"),
  description: yup.string().required("Job description is required"),
  apply_link: yup.string().url("Must be a valid URL").nullable(),
});

const JobsInterface = () => {
  const { showNotification } = useNotification();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      experience: [0.5, 2.5],
      description: "",
      deadline: null,
    },
  });

  const handleCreateJob = handleSubmit(async (data) => {
    console.log("Job Post Data:", data);
    try {
      const formData = new FormData();
      formData.append("position", data.jobPosition);
      formData.append("company", data.company);
      formData.append("min_year", data.experience[0]);
      formData.append("max_year", data.experience[1]);
      formData.append("location", data.location);
      formData.append(
        "deadline",
        data.deadline ? dayjs(data.deadline).format("YYYY-MM-DD") : ""
      );
      formData.append("description", data.description);
      formData.append("apply_link", data?.apply_link);
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await api.post("/add-job", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("API Response:", res);

      if (res.data.status === true) {
        showNotification("Job published successfully", "success");
         reset({
    jobPosition: "",
    company: "",
    experience: [0.5, 2.5],
    location: "",
    deadline: null,
    description: "",
    apply_link: "",
  });
      } else {
        showNotification(
          res.data.error || "Job not published successfully",
          "danger"
        );
      }
    } catch (error) {
      showNotification(
        error.message || "Job not published successfully",
        "danger"
      );
      console.log("Error creating job post:", error);
    }
  });

  return (
    <div className="container-fluid">
      <h4 className="mb-4 fw-semibold">Post a Job</h4>

      <form onSubmit={handleCreateJob} className="">
        {/* Job Position */}
        <div className="row g-2 g-lg-3">
          <div className="col-md-6">
            <TextField
              label="Job Position"
              fullWidth
              {...register("jobPosition")}
              error={!!errors.jobPosition}
              helperText={errors.jobPosition?.message}
            />
          </div>

          {/* Company */}
          <div className="col-md-6">
            <TextField
              label="Company"
              fullWidth
              {...register("company")}
              error={!!errors.company}
              helperText={errors.company?.message}
            />
          </div>

          {/* Experience Range */}
          <div className="col-md-6">
            <label className="form-label fw-medium">Experience (Years)</label>

            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <>
                  <Slider
                    value={field.value}
                    onChange={(_, value) => field.onChange(value)}
                    valueLabelDisplay="auto"
                    step={0.5} // 👈 FLOAT STEP
                    min={0}
                    max={30}
                    marks={[
                      { value: 0, label: "0" },
                      { value: 5, label: "5" },
                      { value: 10, label: "10" },
                      { value: 20, label: "20" },
                      { value: 30, label: "30" },
                    ]}
                  />

                  <div className="text-muted small mt-1">
                    {field.value[0]} yrs – {field.value[1]} yrs
                  </div>
                </>
              )}
            />

            {errors.experience && (
              <div className="text-danger small">
                {errors.experience.message}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="col-md-6">
            <TextField
              label="Location"
              fullWidth
              {...register("location")}
              error={!!errors.location}
              helperText={errors.location?.message}
            />
          </div>

          {/* Last Date to Apply */}
          <div className="col-md-6">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="deadline"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Last Date to Apply"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.deadline,
                        helperText: errors.deadline?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          {/* APPLY lINK */}
          <div className="col-md-6">
            <TextField
              label="Apply Link"
              fullWidth
              {...register("apply_link")}
              error={!!errors.apply_link}
              helperText={errors.apply_link?.message}
            />
          </div>
          {/* Job Description */}
          <div className="col-12">
            <label className="form-label fw-medium">Job Description</label>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Box
                  className={`border rounded ${
                    errors.description ? "border-danger" : ""
                  }`}
                >
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    className="bg-white"
                  />
                </Box>
              )}
            />

            {errors.description && (
              <div className="text-danger small mt-1">
                {errors.description.message}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="col-12">
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<PublishIcon />}
              className="px-5"
              sx={{
                backgroundColor: "#074568",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#05364f",
                },
              }}
            >
              Publish Job
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobsInterface;

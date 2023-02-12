/**
 * Model for partogramme
 */
export default interface Partogramme {
    id: string,
    no_case: string,
    admission_time: Date,
    commentary: string,
    start_work_time: Date,
    state: string,
    center_name: string,
    nurse_id: string
}